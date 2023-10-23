from django.shortcuts import render

# Create your views here.
def pyramid(request):
    return render(request, "pyramid/pyramid.html")