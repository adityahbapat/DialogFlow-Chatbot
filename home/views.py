from django.http.response import HttpResponse
from django.shortcuts import render
import requests

# Create your views here.
# from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout


def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(username  = username, password = password)

        if user:
            if user.is_active:
                login(request,user)
                return render(request,'home/index.html')
            else:
                return HttpResponse("Account Not Active!")
        else:
            print("Username {} failed to login".format(username))
            return HttpResponse("Invalid login details entered.")
    else:
        return render(request,"home/index.html")

def reservations(request):
    if request.method == 'GET':
        # get tables through express server
        tablesResponse = requests.get("http://localhost:3333/getTables/").json()
        return render(request,"home/reservations.html",{"tables":tablesResponse})