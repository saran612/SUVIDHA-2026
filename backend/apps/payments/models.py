from django.db import models
from django.conf import settings
from apps.billing.models import Bill

class Payment(models.Model):
    class Method(models.TextChoices):
        DEBIT_CARD = 'DEBIT_CARD', 'Debit Card'
        UPI = 'UPI', 'UPI'
        NET_BANKING = 'NET_BANKING', 'Net Banking'

    class Status(models.TextChoices):
        INITIATED = 'INITIATED', 'Initiated'
        SUCCESS = 'SUCCESS', 'Success'
        FAILURE = 'FAILURE', 'Failure'
        REFUNDED = 'REFUNDED', 'Refunded'

    payment_id = models.CharField(max_length=50, unique=True)
    bill = models.ForeignKey(Bill, on_delete=models.PROTECT, related_name='payments')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method = models.CharField(max_length=50, choices=Method.choices)
    transaction_id = models.CharField(max_length=100, blank=True, null=True, help_text="Gateway Transaction ID")
    gateway_reference = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.INITIATED)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.payment_id} - {self.status}"

class PaymentReceipt(models.Model):
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='receipt')
    receipt_number = models.CharField(max_length=50, unique=True)
    receipt_data = models.JSONField(help_text="Full receipt details for printing")
    generated_at = models.DateTimeField(auto_now_add=True)
