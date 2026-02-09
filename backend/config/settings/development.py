from .base import *

DEBUG = True
SECRET_KEY = 'django-insecure-dev-key-for-testing'

# Allow all hosts in dev
ALLOWED_HOSTS = ['*']

# CORS for local development
CORS_ALLOW_ALL_ORIGINS = True

# Email backend for development (console)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
