from django.shortcuts import render
from django.http import JsonResponse
from django.core import serializers
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.core.serializers.json import DjangoJSONEncoder

import pandas as pd
from pathlib import Path
from user_auth.models import User
from todo.models import DailyLogin
import json

CURRENT_DIR = Path(__file__).parent
PATH_TO_CSV = CURRENT_DIR/"files"/"log.csv"

# Read the CSV file into a DataFrame
LOG_DF = pd.read_csv(PATH_TO_CSV)


# Create your views here.
def read_csv(request):
    filter = request.GET.get("filter", None) 
    value = request.GET.get("value", None)

    # if not filter and not value:
    #     json_data = LOG_DF.to_json(orient='split')    
    #     return JsonResponse(json.loads(json_data), safe=False)


    # print(filter, value)
    # if filter == "user_agent_browser":
    #     filtered_df = LOG_DF[LOG_DF[filter] == value]
    # elif filter == "logged_in_after_attempt":
    #     filtered_df = LOG_DF[LOG_DF[filter] == (False if value == "false" else True)]
    # elif filter == "request_time":
    #     filtered_df = LOG_DF[LOG_DF['request_time'].str.startswith(value)]
    
    filtered_df = LOG_DF[LOG_DF[filter] == value] if filter == "user_agent_browser" and value \
        else LOG_DF[LOG_DF[filter] == (False if value == "false" else True)] if filter == "logged_in_after_attempt" and value \
        else LOG_DF[LOG_DF['request_time'].str.startswith(value)] if filter == "request_time" and value \
        else LOG_DF

    json_data = filtered_df.to_json(orient='split')
    return JsonResponse(json.loads(json_data), safe=False)


def users_last_login(request):
    users_grouped_by_last_login = DailyLogin.objects.annotate(
        last_login_date=TruncDate('last_login')
    ).values('last_login_date').annotate(
        user_count=Count('user', distinct=True)
    ).order_by('last_login_date')

    #serialized_model = serializers.serialize("json", list(users_grouped_by_last_login))
    return JsonResponse(list(users_grouped_by_last_login), safe=False)

def users_list(request):
    serilized_data = serializers.serialize("json", User.objects.all(), fields=["last_login", "is_superuser", "username", "email", "is_staff", "is_active", "date_joined"])
    return JsonResponse(json.loads(serilized_data), safe=False)


def get_filters(request):
    LOG_DF_COPY = LOG_DF.copy()
    LOG_DF_COPY['request_time'] = pd.to_datetime(LOG_DF_COPY['request_time'], errors='coerce')
    LOG_DF_COPY['date_only'] = LOG_DF_COPY['request_time'].dt.date

    # Specify the columns you want to get unique values from
    columns = ['logged_in_after_attempt', 'user_agent_browser']

    # Get unique values for each specified column
    unique_values_dict = {
        col: LOG_DF_COPY[col].unique().tolist() 
        for col in columns
    }

    unique_values_dict["request_time"] = LOG_DF_COPY['date_only'].astype(str).unique().tolist()

    # Convert the dictionary to JSON
    unique_json = pd.Series(unique_values_dict).to_json()

    return JsonResponse(json.loads(unique_json), safe=False)


