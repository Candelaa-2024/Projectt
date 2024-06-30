from django.shortcuts import render
from django.http import JsonResponse
from django.core import serializers
from django.db.models import Count
from django.db.models.functions import TruncDate
from django.core.serializers.json import DjangoJSONEncoder

import pandas as pd
from pathlib import Path
from user_auth.models import User
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

def users_last_login(request):
    users_grouped_by_last_login = User.objects.annotate(
        last_login_date=TruncDate('last_login')
    ).values('last_login_date').annotate(
        user_count=Count('id')
    ).order_by('last_login_date')

    #serialized_model = serializers.serialize("json", list(users_grouped_by_last_login))
    return JsonResponse(list(users_grouped_by_last_login), safe=False)

def users_list(request):
    serilized_data = serializers.serialize("json", User.objects.all(), fields=["last_login", "is_superuser", "username", "email", "is_staff", "is_active", "date_joined"])
    return JsonResponse(json.loads(serilized_data), safe=False)