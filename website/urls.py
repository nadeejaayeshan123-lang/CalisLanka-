from django.urls import path
from . import views

app_name = "website"

urlpatterns = [
    path("", views.home, name="home"),
    path("blog/", views.blog, name="blog"),
    path("appointment/", views.appointment, name="appointment"),
]
