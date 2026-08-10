# CalisLanka Django Website

This repository contains the CalisLanka frontend converted from standalone HTML into a Django-ready project structure.

## Current stage

- Home page converted to a Django template.
- Blog page converted to a Django template.
- Appointment page converted to a Django template.
- Shared header and footer moved to `website/templates/website/base.html`.
- CSS moved to `website/static/website/css/style.css`.
- JavaScript moved to `website/static/website/js/main.js`.
- Django URL routing added for Home, Blog, and Appointment.
- PostgreSQL and appointment backend functionality are intentionally not configured yet.

The Appointment form currently preserves the original frontend-only demo behaviour. Submitting it displays the success state but does not save any data yet.

## Run locally

```bash
python -m venv .venv
```

Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Then open `http://127.0.0.1:8000/`.

## Routes

- `/` — Home
- `/blog/` — Blog
- `/appointment/` — Appointment

## Next development stage

1. Configure PostgreSQL.
2. Create appointment and availability models.
3. Connect the Appointment form to Django.
4. Add server-side form validation.
5. Add schedule and double-booking prevention logic.
6. Configure Django Admin for appointments and schedules.
7. Add email confirmation and administrator notifications.
8. Test the complete booking workflow.
