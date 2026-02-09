from django.urls import path
from .views import UserProfileView, UserPreferencesView, UserCreateAPIView, SendLoginOTPView, VerifyLoginOTPView

urlpatterns = [
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('preferences/', UserPreferencesView.as_view(), name='user-preferences'),
    path('create-user/', UserCreateAPIView.as_view(), name='user-create'),
    path('login/send-otp/', SendLoginOTPView.as_view(), name='send-login-otp'),
    path('login/verify-otp/', VerifyLoginOTPView.as_view(), name='verify-login-otp'),
    # 'accounts/' would likely link to the billing apps, implemented there or aggregated here.
]
