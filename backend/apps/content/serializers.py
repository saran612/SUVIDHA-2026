from rest_framework import serializers
from .models import ServiceContent, FAQContent

class ServiceContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceContent
        fields = '__all__'

class FAQContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQContent
        fields = '__all__'
