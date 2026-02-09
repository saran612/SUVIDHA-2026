from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        CITIZEN = 'CITIZEN', _('Citizen')
        ADMIN = 'ADMIN', _('Admin')
        SUPERADMIN = 'SUPERADMIN', _('SuperAdmin')

    phone = models.CharField(max_length=15, unique=True, help_text=_("Registered mobile number"))
    consumer_number = models.CharField(max_length=50, blank=True, null=True, unique=True, help_text=_("Primary Consumer Number for login"))
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CITIZEN)
    language_preference = models.CharField(max_length=10, default='en')
    created_at = models.DateTimeField(auto_now_add=True)
    
    # REQUIRED_FIELDS must contain all required fields on top of USERNAME_FIELD
    # We'll stick to 'username' as the internal identifier, but maybe use phone for auth.
    REQUIRED_FIELDS = ['phone', 'email']

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')

    def __str__(self):
        return f"{self.username} ({self.role})"

class OTPVerification(models.Model):
    class OtpType(models.TextChoices):
        LOGIN = 'LOGIN', _('Login')
        RESET_PASSWORD = 'RESET', _('Reset Password')
        VERIFY_PHONE = 'VERIFY', _('Verify Phone')

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='otps')
    otp_code = models.CharField(max_length=6)
    otp_type = models.CharField(max_length=20, choices=OtpType.choices, default=OtpType.LOGIN)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.otp_code}"

class UserSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='kiosk_sessions')
    token = models.CharField(max_length=500, help_text=_("JTI or truncated token"))
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    device_info = models.TextField(blank=True)
    last_activity = models.DateTimeField(auto_now=True)
    logout_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Session for {self.user.username} at {self.created_at}"
