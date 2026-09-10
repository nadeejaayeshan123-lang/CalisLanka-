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
- Admin-managed gallery: the 7-photo "Inside the Studio" grid and an optional
  "Studio in Motion" video section on the homepage are now driven by a
  `GalleryItem` model, editable from `/admin/`.
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
python manage.py createsuperuser
python manage.py runserver
```

Then open `http://127.0.0.1:8000/`.

## Routes

- `/` — Home
- `/blog/` — Blog
- `/appointment/` — Appointment
- `/admin/` — Admin panel (log in with the superuser you created above)

## Managing gallery photos & videos

1. Go to `/admin/` and log in.
2. Under **Website > Gallery items**, click **Add gallery item**.
3. Set the type (Photo or Video), upload the file, optionally add a title,
   set an **Order** (photos: 1-7 correspond to the 7 grid positions on the
   homepage), and make sure **Is active** is checked.
4. To remove something, tick its checkbox in the list and choose
   **Delete** — the uploaded file is deleted from disk too, not just hidden.
   Unchecking **Is active** instead just hides it without deleting it.
5. With zero active photos the homepage falls back to the original
   placeholder images, so the site never looks broken. The video section
   only appears once at least one active video exists.

Uploaded files are stored under `media/` (already git-ignored). Requires
`Pillow`, which is now in `requirements.txt`.

## Next development stage

1. Configure PostgreSQL.
2. Create appointment and availability models.
3. Connect the Appointment form to Django.
4. Add server-side form validation.
5. Add schedule and double-booking prevention logic.
6. Configure Django Admin for appointments and schedules.
7. Add email confirmation and administrator notifications.
8. Test the complete booking workflow.