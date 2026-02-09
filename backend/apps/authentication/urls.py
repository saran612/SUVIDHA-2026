from django.urls import path
from .views import SendOTPView, VerifyOTPView

urlpatterns = [
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('resend-otp/', SendOTPView.as_view(), name='resend-otp'), # Re-uses send logic with checks
]
