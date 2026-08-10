from django.urls import path
from . import views
from bookings.views import appointment_request

app_name = "website"

urlpatterns = [
    path(
        "",
        views.home,
        name="home"
    ),

    path(
        "blog/",
        views.blog,
        name="blog"
    ),

    path(
        "appointment/",
        appointment_request,
        name="appointment"
    ),
]