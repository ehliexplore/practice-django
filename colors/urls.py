from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path('red/', views.red, name="red"),
    path('blue/', views.blue, name="blue"),
    path('yellow/', views.yellow, name="yellow"),
]