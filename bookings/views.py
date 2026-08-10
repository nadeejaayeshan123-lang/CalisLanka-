from django.http import HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .forms import AppointmentForm
from .services import notify_admin_new_appointment


def appointment_request(request):
    submitted = request.GET.get("submitted") == "1"

    if request.method == "POST":
        form = AppointmentForm(request.POST)

        if form.is_valid():
            appointment = form.save()

            email_sent = notify_admin_new_appointment(
                appointment
            )

            if email_sent:
                appointment.email_notification_sent = True
                appointment.save(
                    update_fields=["email_notification_sent"]
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