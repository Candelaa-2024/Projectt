from functools import wraps
import pandas as pd
import joblib
from django.http import JsonResponse
from django.shortcuts import render
from user_agents import parse
from datetime import datetime, timedelta
from csv import DictWriter, writer
from pathlib import Path


# Loading the model and the encoder objects into variables
# For details on how they work, and how they were trained
# please refer to the train_model.ipynb
CURRENT_DIR = Path(__file__).parent
PARENT_DIR = CURRENT_DIR.parent


ENCODER = joblib.load(f"{str(CURRENT_DIR)}/ml_objects/encoder.pkl")
MODEL = joblib.load(f"{str(CURRENT_DIR)}/ml_objects/model.pkl")
RESULT_ENCODER = joblib.load(f"{CURRENT_DIR}/ml_objects/results_encoder.pkl")
CSV_FILE_PATH = f"{PARENT_DIR}/metadata_api/files/log.csv"
BLACKLIST_FILE_PATH = f"{PARENT_DIR}/metadata_api/files/blacklist.csv"


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def before_and_after_request(route_func):
    """
        This is a decorator for processing a request, specifically the request on the
        login route. It takes in various user metadata from the request object,
        alongside some calculations involving the user logs in the logs csv and
        passes it through a model to detect if the request is suspicious or not

        Algorithm

        1. Read the logs csv file
        2. Create a dictionary and store the required metadata
        3. Call the route function to chekc the response return
        4. Perform some claculations on the logs file to get some data like request frequency within a particular timeframe
        5. Log the current request to the csv file
        6. Compile the data. Create a dataframe, arrange it and pass into the model to detect if the request is suspicious
        7. If the request is detected as suspicious return a json response containing an error message "This request has been detected as suspicious"
        else allow request to go on and return the expected json response
    """
    @wraps(route_func)
    def wrapper(request, *args, **kwargs):
        # Actions to perform before the request
        df = pd.read_csv(CSV_FILE_PATH)
        data_dict, now = {}, pd.to_datetime("today")
        ip_address = get_client_ip(request)

        # Check if the ip address has been blacklisted
        blacklist = pd.read_csv(BLACKLIST_FILE_PATH)
        blacklist["time_till_released"] = pd.to_datetime(blacklist["time_till_released"])
        check_ip = blacklist[blacklist['ip_address'] == ip_address].sort_values('time_till_released', ascending=False)
        first_result = check_ip.head(1)

        if not first_result.empty and first_result.iloc[0]['time_till_released'] > now:
            return JsonResponse({
                "error":True, 
                "message":"Your actions have been limited due to suspicious behaviors."
            }), 400 

        data_dict["ip_address"] = ip_address
        data_dict["request_time"] = now
        data_dict["request_method"] = request.method
        data_dict["response_status_code"] = None

        # Check if a user agent exists which could mean the request was 
        # or was not made from a browser 
        try:
            parsed_agent = parse(str(request.META.get('HTTP_USER_AGENT')))
            data_dict["user_agent_browser"] = parsed_agent.browser.family
            data_dict["user_agent_os"] = parsed_agent.os.family
            data_dict["user_agent_device_brand"] = parsed_agent.device.brand
            data_dict["user_agent_device_model"] = parsed_agent.device.model
        except:
            data_dict["user_agent_browser"] = None
            data_dict["user_agent_os"] = None
            data_dict["user_agent_device_brand"] = None
            data_dict["user_agent_device_model"] = None
        
        # Call the route function
        result = route_func(request, *args, **kwargs)

        # Actions done after the route is called
        data_dict["response_status_code"] = result.status_code
        data_dict["content_type"] = request.META.get('CONTENT_TYPE')

        if result.get("message", None):
            data_dict["logged_in_after_attempt"] = True
        else:
            data_dict["logged_in_after_attempt"] = False

        # Write the extracted data to the csv log file
        with open(CSV_FILE_PATH, "+a", newline="") as file:
            csv_writer = DictWriter(file, fieldnames=list(data_dict.keys()))
            
            # Write the header (optional, but usually desired)
            # writer.writeheader()
            
            csv_writer.writerows([data_dict])

        data_dict.pop("logged_in_after_attempt")

        if not df["request_time"].empty:
            df["request_time"] = pd.to_datetime(df["request_time"])

            # Check for former requests from the same ip address within a 2 minutes time frame 
            total_req = df[
                (df['request_time'] >= (now - timedelta(minutes=2))) 
                & (df["ip_address"] == data_dict["ip_address"])
            ]

            #print(data_dict, total_req)

            converted_dataframe = pd.DataFrame(data_dict, index=[0])
            
            #print(converted_dataframe)

            converted_dataframe["num_tries_per_mins"] = total_req.shape[0]
            converted_dataframe["failed_attempts"] = total_req[total_req["request_method"] != 200].shape[0]
            converted_dataframe["still_entered"] = not total_req[total_req["request_method"] == 200].empty

            converted_dataframe.drop(["ip_address", "request_time"], axis=1, inplace=True)

            # Remove columns not needed to run through the encoder, 
            # and arrange them according to the order they were fit into the encoder
            extracted_col = converted_dataframe.drop(["failed_attempts", "num_tries_per_mins"], axis=1)
            extracted_col = extracted_col[ENCODER.feature_names_in_]

            transformation = ENCODER.transform(extracted_col)

            converted_dataframe[extracted_col.columns] = transformation
            converted_dataframe.fillna(9999, inplace=True)

            # Arrange columns in the dataframe for predicting according to the way
            # it was arranged in the model
            converted_dataframe = converted_dataframe[MODEL.feature_names_in_]
            
            pred = MODEL.predict(converted_dataframe)
            inverse_result = RESULT_ENCODER.inverse_transform(pred)
            print(pred, inverse_result)

            if inverse_result[0]:
                # Write the ip address to a csv file
                with open(BLACKLIST_FILE_PATH, "+a", newline="") as file:
                    csv_writer = writer(file)
                    csv_writer.writerow([ip_address, datetime.now()+timedelta(minutes=5)])
                
                # Add additional context or perform other actions
                result = render(request, "user_auth/signin.html", {
                    "message": "You have been limited for suspicious actions"
                })
        
        return result

    return wrapper
