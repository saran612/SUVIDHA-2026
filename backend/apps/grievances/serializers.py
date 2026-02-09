from rest_framework import serializers
from .models import Complaint, ComplaintUpdate

class ComplaintSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = '__all__'
        read_only_fields = ['complaint_id', 'status', 'created_at', 'resolved_at']

class ComplaintUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintUpdate
        fields = '__all__'
