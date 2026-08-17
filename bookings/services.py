import logging
import re

from django.conf import settings
from django.core.mail import send_mail
from django.utils.html import escape

from .models import BookingSettings


logger = logging.getLogger(__name__)


def create_whatsapp_number(phone):
    """
    Convert a Sri Lankan local phone number into
    the international format required by WhatsApp.
    """

    digits = re.sub(r"\D", "", phone)

    if digits.startswith("0"):
        digits = "94" + digits[1:]

    return digits


def send_appointment_notification(appointment):
    """
    Send a new appointment request notification
    to the configured CalisLanka admin email.
    """

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

    # --------------------------------------------------------
    # PLAIN TEXT EMAIL
    # --------------------------------------------------------

    text_message = f"""
NEW CALISLANKA APPOINTMENT REQUEST

CUSTOMER DETAILS
------------------------------
Name: {appointment.full_name}
Phone: {appointment.phone}
Email: {appointment.email}
Age: {appointment.age or "Not provided"}

APPOINTMENT DETAILS
------------------------------
Program: {appointment.get_program_display()}
Preferred Date: {appointment.preferred_date}
Preferred Time: {appointment.get_preferred_time_display()}
Experience Level: {appointment.get_experience_display()}

CUSTOMER MESSAGE
------------------------------
{appointment.message or "No message provided."}

REQUEST STATUS
------------------------------
Status: {appointment.get_status_display()}

WHATSAPP
------------------------------
{whatsapp_url}

Please log in to the CalisLanka Admin Panel
to review this appointment request.
"""

    # --------------------------------------------------------
    # HTML EMAIL
    # --------------------------------------------------------

    html_message = f"""
    <div style="
        font-family: Arial, sans-serif;
        max-width: 650px;
        margin: auto;
    ">

        <h2>
            New CalisLanka Appointment Request
        </h2>

        <hr>

        <h3>Customer Details</h3>

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
            {escape(str(
                appointment.age
                or "Not provided"
            ))}
        </p>

        <hr>

        <h3>Appointment Details</h3>

        <p>
            <strong>Program:</strong>
            {escape(
                appointment.get_program_display()
            )}
        </p>

        <p>
            <strong>Preferred Date:</strong>
            {escape(
                str(appointment.preferred_date)
            )}
        </p>

        <p>
            <strong>Preferred Time:</strong>
            {escape(
                appointment.get_preferred_time_display()
            )}
        </p>

        <p>
            <strong>Experience Level:</strong>
            {escape(
                appointment.get_experience_display()
            )}
        </p>

        <hr>

        <h3>Customer Message</h3>

        <p>
            {escape(
                appointment.message
                or "No message provided."
            )}
        </p>

        <hr>

        <p>
            <strong>Status:</strong>
            {escape(
                appointment.get_status_display()
            )}
        </p>

        <p>
            <a
                href="{whatsapp_url}"
                style="
                    display: inline-block;
                    padding: 10px 16px;
                    background: #25D366;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                "
            >
                Contact Customer on WhatsApp
            </a>
        </p>

        <p>
            Log in to the CalisLanka Admin Panel
            to manage this appointment request.
        </p>

    </div>
    """

    # --------------------------------------------------------
    # SEND EMAIL
    # --------------------------------------------------------

    try:

        sent = send_mail(
            subject=subject,
            message=text_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient],
            html_message=html_message,
            fail_silently=False,
        )

        if sent == 1:

            appointment.email_notification_sent = True

            appointment.save(
                update_fields=[
                    "email_notification_sent"
                ]
            )

            logger.info(
                "Appointment notification sent "
                "successfully for appointment %s.",
                appointment.pk,
            )

            return True

        return False

    except Exception:

        logger.exception(
            "Failed to send appointment notification email "
            "for appointment %s.",
            appointment.pk,
        )

        return False