from django.urls import path
from .views import InitiatePaymentView, VerifyPaymentView, ReceiptView

urlpatterns = [
    path('initiate/', InitiatePaymentView.as_view(), name='payment-initiate'),
    path('verify/', VerifyPaymentView.as_view(), name='payment-verify'),
    path('receipt/<str:payment_id>/', ReceiptView.as_view(), name='payment-receipt'),
    # path('history/', ...) # generic list view similar to others
]
