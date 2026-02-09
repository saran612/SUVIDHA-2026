from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _

class BaseAccount(models.Model):
    consumer_number = models.CharField(max_length=50, unique=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="%(class)s_accounts")
    account_holder = models.CharField(max_length=100)
    address = models.TextField()
    connection_type = models.CharField(max_length=50, choices=[
        ('RESIDENTIAL', 'Residential'),
        ('COMMERCIAL', 'Commercial'),
        ('INDUSTRIAL', 'Industrial')
    ], default='RESIDENTIAL')

    class Meta:
        abstract = True
        
    def __str__(self):
        return f"{self.consumer_number} - {self.user.username}"

class ElectricityAccount(BaseAccount):
    meter_number = models.CharField(max_length=50)

class GasAccount(BaseAccount):
    pass

class WaterAccount(BaseAccount):
    pass

class Bill(models.Model):
    class Status(models.TextChoices):
        PENDING = 'PENDING', _('Pending')
        PAID = 'PAID', _('Paid')
        OVERDUE = 'OVERDUE', _('Overdue')

    class AccountType(models.TextChoices):
        ELECTRICITY = 'ELECTRICITY', _('Electricity')
        GAS = 'GAS', _('Gas')
        WATER = 'WATER', _('Water')

    bill_id = models.CharField(max_length=50, unique=True, primary_key=True)
    account_type = models.CharField(max_length=20, choices=AccountType.choices)
    consumer_number = models.CharField(max_length=50) # Link by consumer number, loosely coupled if needed
    bill_date = models.DateField()
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    arrears = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)

    def __str__(self):
        return f"{self.bill_id} ({self.status})"

class BillLineItem(models.Model):
    bill = models.ForeignKey(Bill, on_delete=models.CASCADE, related_name='line_items')
    description = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.DecimalField(max_digits=6, decimal_places=2, default=1)
