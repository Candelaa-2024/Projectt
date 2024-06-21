from django.shortcuts import render
from django.http import JsonResponse

import pandas as pd
from pathlib import Path

import json

CURRENT_DIR = Path(__file__).parent
PATH_TO_CSV = CURRENT_DIR/"files"/"log.csv"

# Create your views here.
def read_csv(request):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(PATH_TO_CSV)
    
    # Convert DataFrame to JSON
    json_data = df.to_json(orient='split')
    
    # Return JSON response
    return JsonResponse(json.loads(json_data), safe=False)