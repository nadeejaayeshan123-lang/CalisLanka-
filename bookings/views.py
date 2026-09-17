from django.core.cache import cache
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

from .forms import AppointmentForm
from .services import send_appointment_notification


# Booking submission rate limit:
# Maximum 3 POST requests from the same IP within 10 minutes.
BOOKING_RATE_LIMIT = 3
BOOKING_RATE_WINDOW = 10 * 60  # 10 minutes


def get_client_ip(request):
    """
    Get the client's IP address.

    For now we use REMOTE_ADDR because trusting arbitrary
    X-Forwarded-For headers can allow clients to bypass
    rate limiting.
    """
    return request.META.get("REMOTE_ADDR", "unknown")


def appointment_request(request):
    submitted = request.GET.get("submitted") == "1"

    if request.method == "POST":
        client_ip = get_client_ip(request)
        cache_key = f"booking-rate-limit:{client_ip}"

        request_count = cache.get(cache_key, 0)

        if request_count >= BOOKING_RATE_LIMIT:
            return HttpResponse(
                "Too many booking requests. Please try again later.",
                status=429,
            )

        # Count this POST request before processing the form.
        cache.set(
            cache_key,
            request_count + 1,
            timeout=BOOKING_RATE_WINDOW,
        )

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