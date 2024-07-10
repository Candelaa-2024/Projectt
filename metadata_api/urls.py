from django.urls import path

from . import views

urlpatterns = [
    path('read-csv/', views.read_csv, name="read_csv"),
    path("users/last-login/",views.users_last_login, name="users_last_login"),
    path("users/list/",views.users_list, name="users_list"),
    path("filters/list/",views.get_filters, name="get_filters"),
]