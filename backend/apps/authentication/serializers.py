from rest_framework import serializers

class SendOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15, min_length=10)

class VerifyOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15, min_length=10)
    otp = serializers.CharField(max_length=6, min_length=6)
