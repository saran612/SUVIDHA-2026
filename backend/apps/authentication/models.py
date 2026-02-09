from django.db import models
from django.utils.translation import gettext_lazy as _

class PhoneOTP(models.Model):
    phone = models.CharField(max_length=15, help_text=_("Phone number with country code"))
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.phone} - {self.otp}"
