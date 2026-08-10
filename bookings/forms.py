from django import forms
from django.utils import timezone

from .models import Appointment


class AppointmentForm(forms.ModelForm):

    class Meta:
        model = Appointment

        fields = (
            "full_name",
            "phone",
            "email",
            "age",
            "program",
            "preferred_date",
            "preferred_time",
            "experience",
            "message",
        )

        widgets = {
            "full_name": forms.TextInput(
                attrs={
                    "placeholder": "Your name"
                }
            ),

            "phone": forms.TextInput(
                attrs={
                    "placeholder": "+94 77 000 0000"
                }
            ),

            "email": forms.EmailInput(
                attrs={
                    "placeholder": "you@email.com"
                }
            ),

            "age": forms.NumberInput(
                attrs={
                    "placeholder": "Your age"
                }
            ),

            "preferred_date": forms.DateInput(
                attrs={
                    "type": "date"
                }
            ),

            "message": forms.Textarea(
                attrs={
                    "rows": 5,
                    "placeholder":
                    "Tell us what you want to achieve..."
                }
            ),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields["preferred_date"].widget.attrs[
            "min"
        ] = timezone.localdate().isoformat()