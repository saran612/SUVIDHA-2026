from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'phone', 'consumer_number', 'role', 'language_preference', 'date_joined']
        read_only_fields = ['id', 'username', 'role', 'date_joined']

class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['language_preference']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'phone', 'password', 'role', 'first_name', 'last_name', 'consumer_number']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'consumer_number': {'required': False},
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True, help_text="Phone number or Consumer Number")

    def validate_identifier(self, value):
        if not value:
            raise serializers.ValidationError("Identifier is required.")
        return value

class VerifyLoginOTPSerializer(serializers.Serializer):
    identifier = serializers.CharField(required=True, help_text="Phone number or Consumer Number")
    otp = serializers.CharField(required=True, min_length=6, max_length=6)

