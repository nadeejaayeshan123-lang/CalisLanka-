from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class BookingSettings(models.Model):
    notification_email = models.EmailField(
        help_text="New appointment requests will be sent to this email address."
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Booking notification setting"
        verbose_name_plural = "Booking notification settings"

    def save(self, *args, **kwargs):
        # Only one settings record is needed.
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def get_notification_email(cls):
        booking_settings = cls.objects.first()

        if booking_settings and booking_settings.notification_email:
            return booking_settings.notification_email

        return getattr(settings, "ADMIN_BOOKING_EMAIL", "")

    def __str__(self):
        return self.notification_email


class Appointment(models.Model):

    class Program(models.TextChoices):
        PERSONAL_TRAINING = (
            "personal_training",
            "Personal Training"
        )

        ONLINE_COACHING = (
            "online_coaching",
            "Online Coaching"
        )

        STRENGTH_CONDITIONING = (
            "strength_conditioning",
            "Strength & Conditioning"
        )

        NUTRITION_PLANS = (
            "nutrition_plans",
            "Nutrition Plans"
        )

    class PreferredTime(models.TextChoices):
        MORNING = (
            "morning",
            "Morning"
        )

        AFTERNOON = (
            "afternoon",
            "Afternoon"
        )

        EVENING = (
            "evening",
            "Evening"
        )

    class Experience(models.TextChoices):
        COMPLETE_BEGINNER = (
            "complete_beginner",
            "Complete beginner"
        )

        BEGINNER = (
            "beginner",
            "Beginner"
        )

        INTERMEDIATE = (
            "intermediate",
            "Intermediate"
        )

        ADVANCED = (
            "advanced",
            "Advanced"
        )

    class Status(models.TextChoices):
        PENDING = (
            "pending",
            "Pending"
        )

        CONFIRMED = (
            "confirmed",
            "Confirmed"
        )

        CANCELLED = (
            "cancelled",
            "Cancelled"
        )

        COMPLETED = (
            "completed",
            "Completed"
        )

    full_name = models.CharField(
        max_length=150
    )

    phone = models.CharField(
        max_length=25
    )

    email = models.EmailField()

    age = models.PositiveSmallIntegerField(
        null=True,
        blank=True
    )

    program = models.CharField(
        max_length=40,
        choices=Program.choices
    )

    preferred_date = models.DateField()

    preferred_time = models.CharField(
        max_length=20,
        choices=PreferredTime.choices
    )

    experience = models.CharField(
        max_length=30,
        choices=Experience.choices,
        default=Experience.COMPLETE_BEGINNER
    )

    message = models.TextField(
        blank=True
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING
    )

    # Admin can record the final agreed appointment
    # after contacting the customer.
    confirmed_date = models.DateField(
        null=True,
        blank=True
    )

    confirmed_time = models.TimeField(
        null=True,
        blank=True
    )

    admin_notes = models.TextField(
        blank=True
    )

    email_notification_sent = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    def clean(self):
        super().clean()

        if self.age is not None:
            if self.age < 10 or self.age > 100:
                raise ValidationError({
                    "age": "Please enter a valid age."
                })

        if (
            self.preferred_date
            and self.preferred_date < timezone.localdate()
        ):
            raise ValidationError({
                "preferred_date":
                "The preferred date cannot be in the past."
            })

    def __str__(self):
        return (
            f"{self.full_name} - "
            f"{self.get_program_display()} - "
            f"{self.preferred_date}"
        )