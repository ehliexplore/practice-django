from django.urls import path

from . import views

urlpatterns = [
    path("", views.circles, name="circles"),
]