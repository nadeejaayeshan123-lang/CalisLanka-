from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .forms import AppointmentForm
from .services import send_appointment_notification


def appointment_request(request):
    submitted = request.GET.get("submitted") == "1"

    if request.method == "POST":
        form = AppointmentForm(request.POST)

        if form.is_valid():
            # Save appointment to PostgreSQL first
            appointment = form.save()

            # Send appointment details to admin email
            email_sent = send_appointment_notification(
                appointment
            )

            if email_sent:
                print(
                    "Appointment saved and admin "
                    "notification email sent successfully."
                )
            else:
                print(
                    "Appointment saved, but admin "
                    "notification email was not sent."
                )

            return HttpResponseRedirect(
                reverse("website:appointment")
                + "?submitted=1"
            )

    else:
        form = AppointmentForm()

    return render(
        request,
        "website/appointment.html",
        {
            "form": form,
            "submitted": submitted,
        },
    )