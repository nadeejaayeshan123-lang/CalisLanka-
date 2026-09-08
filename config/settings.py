from pathlib import Path
import os

from dotenv import load_dotenv


# ============================================================
# BASE DIRECTORY
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent


# ============================================================
# ENVIRONMENT VARIABLES
# ============================================================

load_dotenv(BASE_DIR / ".env", override=True)


# ============================================================
# SECURITY
# ============================================================

# Development-only fallback.
# For production, SECRET_KEY should be stored in .env.
SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "django-insecure-development-only-calislanka",
)

DEBUG = True

ALLOWED_HOSTS = []


# ============================================================
# APPLICATIONS
# ============================================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # CalisLanka applications
    "website",
    "bookings",
]


# ============================================================
# MIDDLEWARE
# ============================================================

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]


# ============================================================
# URL CONFIGURATION
# ============================================================

ROOT_URLCONF = "config.urls"


# ============================================================
# TEMPLATES
# ============================================================

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]


# ============================================================
# WSGI
# ============================================================

WSGI_APPLICATION = "config.wsgi.application"


# ============================================================
# DATABASE
# PostgreSQL
# ============================================================

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("DB_NAME"),
        "USER": os.getenv("DB_USER"),
        "PASSWORD": os.getenv("DB_PASSWORD"),
        "HOST": os.getenv("DB_HOST", "127.0.0.1"),
        "PORT": os.getenv("DB_PORT", "5432"),
    }
}


# ============================================================
# PASSWORD VALIDATION
# ============================================================

AUTH_PASSWORD_VALIDATORS = []


# ============================================================
# LANGUAGE / TIMEZONE
# ============================================================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "Asia/Colombo"

USE_I18N = True

USE_TZ = True


# ============================================================
# STATIC FILES
# ============================================================

STATIC_URL = "static/"

STATIC_ROOT = BASE_DIR / "staticfiles"


# ============================================================
# DEFAULT PRIMARY KEY
# ============================================================

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"


# ============================================================
# EMAIL / SMTP
# Django 6.1 MAILERS Configuration
# ============================================================

MAILERS = {
    "default": {
        "BACKEND": "django.core.mail.backends.smtp.EmailBackend",
        "OPTIONS": {
            "host": os.getenv(
                "EMAIL_HOST",
                "smtp.gmail.com",
            ),
            "port": int(
                os.getenv(
                    "EMAIL_PORT",
                    "587",
                )
            ),
            "username": os.getenv(
                "EMAIL_HOST_USER"
            ),
            "password": os.getenv(
                "EMAIL_HOST_PASSWORD"
            ),
            "use_tls": os.getenv(
                "EMAIL_USE_TLS",
                "True",
            ).lower() == "true",
            "timeout": 10,
        },
    }
}


# ============================================================
# DEFAULT EMAIL SENDER
# ============================================================

DEFAULT_FROM_EMAIL = os.getenv(
    "DEFAULT_FROM_EMAIL",
    os.getenv(
        "EMAIL_HOST_USER",
        "webmaster@localhost",
    ),
)


# ============================================================
# ADMIN BOOKING NOTIFICATION EMAIL
# ============================================================

# Default recipient for new appointment notifications.
#
# This can later be overridden through:
#
# Django Admin
# -> Bookings
# -> Booking notification settings

ADMIN_BOOKING_EMAIL = os.getenv(
    "ADMIN_BOOKING_EMAIL",
    "",
)