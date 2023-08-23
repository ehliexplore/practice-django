from django.shortcuts import render

# Create your views here.
def circles(request):
    return render(request, "circles/circles.html")
