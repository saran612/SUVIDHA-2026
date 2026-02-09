from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Payment, PaymentReceipt
from apps.billing.models import Bill
from .serializers import PaymentSerializer, PaymentInitiateSerializer, PaymentVerifySerializer
from django.utils import timezone
import uuid

class InitiatePaymentView(generics.CreateAPIView):
    serializer_class = PaymentInitiateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # Generate ID
        pid = f"PAY-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(user=self.request.user, payment_id=pid, status=Payment.Status.INITIATED)

class VerifyPaymentView(generics.GenericAPIView):
    serializer_class = PaymentVerifySerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            pid = serializer.validated_data['payment_id']
            status_val = serializer.validated_data['status']
            tx_id = serializer.validated_data['transaction_id']

            try:
                payment = Payment.objects.get(payment_id=pid)
                payment.status = status_val
                payment.transaction_id = tx_id
                payment.save()

                if status_val == 'SUCCESS':
                    # Close Bill
                     payment.bill.status = Bill.Status.PAID
                     payment.bill.save()
                     
                     # Generate Receipt
                     PaymentReceipt.objects.create(
                         payment=payment,
                         receipt_number=f"REC-{uuid.uuid4().hex[:8].upper()}",
                         receipt_data={"amount": str(payment.amount), "date": str(timezone.now())}
                     )

                return Response({'success': True, 'status': payment.status})
            except Payment.DoesNotExist:
                return Response({'success': False, 'message': 'Payment Not Found'}, status=404)
        return Response(serializer.errors, status=400)

class ReceiptView(generics.RetrieveAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'payment_id'
