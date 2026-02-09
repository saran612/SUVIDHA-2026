from django.db import models
from django.conf import settings

class Notification(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=50) # ALERT, INFO, BILL
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

class SystemAlert(models.Model):
    alert_type = models.CharField(max_length=50)
    title = models.CharField(max_length=200)
    message = models.TextField()
    severity = models.CharField(max_length=20, choices=[('LOW', 'Low'), ('HIGH', 'High'), ('CRITICAL', 'Critical')])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
