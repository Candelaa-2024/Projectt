from django.shortcuts import render

# Create your views here.
def loginview(request):
    if request.method == "GET":
        return render(request, "user_auth/signin.html", {})
    

def signup(request):
    if request.method == "GET":
        return render(request, "user_auth/signup.html", {})