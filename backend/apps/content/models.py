from django.db import models

class ServiceContent(models.Model):
    service_type = models.CharField(max_length=50)
    language = models.CharField(max_length=10) # e.g. 'en', 'hi'
    title = models.CharField(max_length=200)
    description = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('service_type', 'language')

class FAQContent(models.Model):
    category = models.CharField(max_length=50)
    language = models.CharField(max_length=10)
    question = models.TextField()
    answer = models.TextField()
