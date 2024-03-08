import os
from datetime import timedelta
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get("SECRET_KEY", "DummyKey")
ENVIRONMENT = os.environ.get("ENVIRONMENT", "dev")
DEBUG = bool(os.environ.get("DEBUG", True))
ALLOWED_HOSTS = list(map(str.strip, os.environ.get("ALLOWED_HOSTS", "").split(",")))
CORS_ORIGIN_WHITELIST = list(os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost").split(","))
CORS_ALLOWED_ORIGINS = CORS_ORIGIN_WHITELIST
CSRF_TRUSTED_ORIGINS = CORS_ORIGIN_WHITELIST


INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "corsheaders",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django_extensions",
    "authentication",
    "drf_spectacular",
    "checklist",
]

SHELL_PLUS_IMPORTS = [
    "from mixer.backend.django import mixer",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=int(os.environ.get("ACCESS_TOKEN_LIFETIME", 1))),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=int(os.environ.get("REFRESH_TOKEN_LIFETIME_DAYS", 1))),
}
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "core.paginators.ResultSetPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_AUTHENTICATION_CLASSES": ("rest_framework_simplejwt.authentication.JWTAuthentication",),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
}
SPECTACULAR_SETTINGS = {
    "TITLE": "Checklist manager API",
    "DESCRIPTION": "App to manage QA department checklists",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    "COMPONENT_SPLIT_REQUEST": True,
}


WSGI_APPLICATION = "core.wsgi.application"

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ.get("POSTGRES_DB", ""),
        "USER": os.environ.get("POSTGRES_USER", ""),
        "PASSWORD": os.environ.get("POSTGRES_PASSWORD", ""),
        "HOST": os.environ.get("DB_HOST", ""),
        "PORT": os.environ.get("DB_PORT", ""),
    },
}


AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


LANGUAGE_CODE = "en-us"

TIME_ZONE = "Europe/Kiev"

USE_I18N = True

USE_TZ = True

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
AUTH_USER_MODEL = "authentication.User"
STATIC_URL = "/static/"
STATIC_ROOT = os.path.abspath(os.path.join(BASE_DIR, "static"))
MEDIA_ROOT = os.path.abspath(os.path.join(BASE_DIR, "attachments"))
MEDIA_URL = "/attachments/"
CELERY_BROKER_URL = os.environ.get("REDIS_URL", "redis://redis:6379")
CELERY_RESULT_BACKEND = CELERY_BROKER_URL
CELERY_TASK_DEFAULT_QUEUE = "django"
CELERY_BEAT_SCHEDULER = "redbeat.RedBeatScheduler"
CELERY_TASK_DEFAULT_QUEUE = "django"
CELERY_BEAT_SCHEDULE = {}

# Logging
DJANGO_LOGFILE_NAME = os.environ.get("DJANGO_LOG_PATH", os.path.join(BASE_DIR, ".data/django/django.log"))
LOGFILE_SIZE = 5 * 1024 * 1024
CELERY_LOGFILE_NAME = os.environ.get("CELERY_LOG_PATH", os.path.join(BASE_DIR, ".data/django/celery.log"))

if not Path(os.path.dirname(DJANGO_LOGFILE_NAME)).exists():
    Path(os.path.dirname(DJANGO_LOGFILE_NAME)).mkdir(parents=True)
if not Path(os.path.dirname(CELERY_LOGFILE_NAME)).exists():
    Path(os.path.dirname(CELERY_LOGFILE_NAME)).mkdir(parents=True)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "formatters": {
        "verbose": {"format": "%(levelname)s [%(asctime)s] - [%(name)s:%(funcName)s:%(lineno)s] %(message)s"},
    },
    "handlers": {
        "logfile": {
            "level": "DEBUG",
            "formatter": "verbose",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": DJANGO_LOGFILE_NAME,
            "maxBytes": LOGFILE_SIZE,
        },
        "celery_file": {
            "level": "DEBUG",
            "formatter": "verbose",
            "class": "logging.handlers.RotatingFileHandler",
            "filename": CELERY_LOGFILE_NAME,
            "maxBytes": LOGFILE_SIZE,
        },
        "console": {
            "level": "DEBUG",
            "formatter": "verbose",
            "class": "logging.StreamHandler",
        },
    },
    "loggers": {
        "celery": {
            "handlers": ["celery_file", "console"],
            "propagate": True,
            "level": os.environ.get("CELERY_LOG_LEVEL", "INFO"),
        },
        "django": {
            "handlers": ["logfile", "console"],
            "propagate": True,
            "level": os.environ.get("DJANGO_LOG_LEVEL", "INFO"),
        },
    },
}

SITE_URL = os.environ.get("SITE_URL", default="http://localhost:3000")
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", default="noreply@homelab.com")
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_USE_TLS = True
EMAIL_HOST = os.environ.get("EMAIL_HOST")
EMAIL_PORT = os.environ.get("EMAIL_PORT", 25)
EMAIL_HOST_USER = os.environ.get("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD = os.environ.get("EMAIL_HOST_PASSWORD", default="")
EMAIL_USE_SSL = os.environ.get("EMAIL_USE_SSL", False)
