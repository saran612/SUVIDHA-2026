from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class ServiceRequest(models.Model):
    class Status(models.TextChoices):
        SUBMITTED = 'SUBMITTED', _('Submitted')
        PROCESSING = 'PROCESSING', _('Processing')
        APPROVED = 'APPROVED', _('Approved')
        REJECTED = 'REJECTED', _('Rejected')

    request_id = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    service_type = models.CharField(max_length=50) # e.g. New Connection, Load Change
    request_type = models.CharField(max_length=50)
    details = models.JSONField(default=dict)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SUBMITTED)
    created_at = models.DateTimeField(auto_now_add=True)

class RequestDocument(models.Model):
    service_request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name='documents')
    document_type = models.CharField(max_length=50) # e.g. ID Proof, Property Deed
    file_path = models.FileField(upload_to='service_requests/documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
