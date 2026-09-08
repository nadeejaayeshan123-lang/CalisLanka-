import re

from django.contrib import admin
from django.utils.html import format_html

from .models import Appointment, BookingSettings


@admin.register(BookingSettings)
class BookingSettingsAdmin(admin.ModelAdmin):
    list_display = (
        "notification_email",
        "updated_at",
    )

    readonly_fields = (
        "updated_at",
    )

    def has_add_permission(self, request):
        # Only allow one configuration record.
        if BookingSettings.objects.exists():
            return False

        return super().has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):

    list_display = (
        "full_name",
        "program",
        "preferred_date",
        "preferred_time",
        "status",
        "whatsapp_contact",
        "email_notification_sent",
        "created_at",
    )

    list_filter = (
        "status",
        "program",
        "preferred_time",
        "preferred_date",
        "experience",
        "email_notification_sent",
    )

    search_fields = (
        "full_name",
        "phone",
        "email",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
        "email_notification_sent",
        "whatsapp_contact",
    )

    ordering = (
        "-created_at",
    )

    fieldsets = (
        (
            "Customer Information",
            {
                "fields": (
                    "full_name",
                    "phone",
                    "email",
                    "age",
                    "whatsapp_contact",
                )
            },
        ),
        (
            "Customer Request",
            {
                "fields": (
                    "program",
                    "preferred_date",
                    "preferred_time",
                    "experience",
                    "message",
                )
            },
        ),
        (
            "Appointment Management",
            {
                "fields": (
                    "status",
                    "confirmed_date",
                    "confirmed_time",
                    "admin_notes",
                )
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "email_notification_sent",
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    @admin.display(description="WhatsApp")
    def whatsapp_contact(self, obj):

        digits = re.sub(r"\D", "", obj.phone)

        if digits.startswith("0"):
            digits = "94" + digits[1:]

        return format_html(
            '<a href="https://wa.me/{}" target="_blank">'
            'Open WhatsApp'
            '</a>',
            digits
        )