from rest_framework import serializers
from .models import Payment, PaymentReceipt

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class PaymentInitiateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['bill', 'amount', 'payment_method']

class PaymentVerifySerializer(serializers.Serializer):
    payment_id = serializers.CharField()
    transaction_id = serializers.CharField()
    status = serializers.ChoiceField(choices=['SUCCESS', 'FAILURE'])
