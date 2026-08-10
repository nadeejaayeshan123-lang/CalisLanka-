import logging
import re

from django.conf import settings
from django.core.mail import send_mail
from django.utils.html import escape

from .models import BookingSettings


logger = logging.getLogger(__name__)


def create_whatsapp_number(phone):
    digits = re.sub(r"\D", "", phone)

    if digits.startswith("0"):
        digits = "94" + digits[1:]

    return digits


def notify_admin_new_appointment(appointment):

    recipient = BookingSettings.get_notification_email()

    if not recipient:
        logger.warning(
            "No CalisLanka booking notification email is configured."
        )
        return False

    whatsapp_number = create_whatsapp_number(
        appointment.phone
    )

    whatsapp_url = (
        f"https://wa.me/{whatsapp_number}"
    )

    subject = (
        "New CalisLanka Appointment Request - "
        f"{appointment.full_name}"
    )

    text_message = f"""
NEW CALISLANKA APPOINTMENT REQUEST

Customer
--------
Name: {appointment.full_name}
Phone: {appointment.phone}
Email: {appointment.email}
Age: {appointment.age or "Not provided"}

Appointment Request
-------------------
Program: {appointment.get_program_display()}
Preferred Date: {appointment.preferred_date}
Preferred Time: {appointment.get_preferred_time_display()}
Experience: {appointment.get_experience_display()}

Message:
{appointment.message or "No message provided"}

Status: Pending

WhatsApp:
{whatsapp_url}
"""

    html_message = f"""
    <h2>New CalisLanka Appointment Request</h2>

    <h3>Customer</h3>

    <p>
        <strong>Name:</strong>
        {escape(appointment.full_name)}
    </p>

    <p>
        <strong>Phone:</strong>
        {escape(appointment.phone)}
    </p>

    <p>
        <strong>Email:</strong>
        {escape(appointment.email)}
    </p>

    <p>
        <strong>Age:</strong>
        {escape(str(appointment.age or "Not provided"))}
    </p>

    <h3>Appointment Request</h3>

    <p>
        <strong>Program:</strong>
        {escape(appointment.get_program_display())}
    </p>

    <p>
        <strong>Preferred Date:</strong>
        {escape(str(appointment.preferred_date))}
    </p>

    <p>
        <strong>Preferred Time:</strong>
        {escape(appointment.get_preferred_time_display())}
    </p>

    <p>
        <strong>Experience:</strong>
        {escape(appointment.get_experience_display())}
    </p>

    <p>
        <strong>Message:</strong><br>
        {escape(appointment.message or "No message provided")}
    </p>

    <p>
        <strong>Status:</strong> Pending
    </p>

    <p>
        <a href="{whatsapp_url}">
            Contact customer on WhatsApp
        </a>
    </p>
    """

    try:

        sent = send_mail(
            subject=subject,
            message=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            fail_silently=False,
            html_message=html_message,
        )

        return sent == 1

    except Exception:
        logger.exception(
            "Failed to send appointment notification email."
        )

        return False