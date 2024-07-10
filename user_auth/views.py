from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from validate_email import validate_email
from .models import User
from .decorators import before_and_after_request
from todo.models import DailyLogin

# Create your views here.
@before_and_after_request
def loginview(request):
    if request.method == "GET":
        return render(request, "user_auth/signin.html", {})
    elif request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "") 

        if not all([username, password]):
            return render(request, "user_auth/signin.html", {
                "message": "Invalid or missing credentials"
            })
        
        user = authenticate(request, username=username.lower(), password=password)

        if user is not None:
            login(request, user)
            last_login = DailyLogin(user=request.user)
            last_login.save()
            return redirect("todo:index")
        else:
            # Return an 'invalid login' error message.
            return render(request, "user_auth/signin.html", {
                "message": "Invalid user details"
            })

    

def signup(request):
    if request.method == "GET":
        return render(request, "user_auth/signup.html", {})
    elif request.method == "POST":
        username = request.POST.get("username", "").strip()
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "") 
        confirm_password = request.POST.get("password-confirm")

        if not all([username, email, password, confirm_password]):
            return render(request, "user_auth/signup.html", {
                "message": "Invalid or missing credentials"
            })


        if password != confirm_password:
            return render(request, "user_auth/signup.html", {
                "message": "Passwords do not match" 
            })
        
        if not validate_email(email):
            return render(request, "user_auth/signup.html", {
                "message": "Invalid Email" 
            })
        
        username_exists = User.objects.filter(username=username).exists()
        email_exists = User.objects.filter(email=email).exists()

        if username_exists:
            return render(request, "user_auth/signup.html", {
                "message": "Username already exists. Please choose a different username" 
            })
        
        if email_exists:
            return render(request, "user_auth/signup.html", {
                "message": "Email already exists. Please use a different email to register" 
            })

        user = User(username=username.lower(), email=email)
        user.set_password(password)

        user.save()

        login(request, user)
        
        return redirect("todo:index")
    
def logout_view(request):
    logout(request)
    # Redirect to a success page.
    return redirect("user_auth:login")