from django.urls import path
from . import views

app_name = "user_auth"

urlpatterns = [
    path('login/', views.loginview, name="login"),
    path('signup/', views.signup, name="signup"),
]