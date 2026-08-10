from django.shortcuts import render


def home(request):
    return render(request, "website/home.html")


def blog(request):
    return render(request, "website/blog.html")


def appointment(request):
    return render(request, "website/appointment.html")
