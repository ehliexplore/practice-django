from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, "colors/index.html")


def red(request):
    return render(request, "colors/red.html")


def blue(request):
    return render(request, "colors/blue.html")


def yellow(request):
    return render(request, "colors/yellow.html")