
from rest_framework import status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import SendOTPSerializer, VerifyOTPSerializer
from .utils import check_spam, create_and_send_otp, verify_otp_logic

User = get_user_model()

class SendOTPView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']

            # 1. Check Spam / Rate Limit
            allowed, message = check_spam(phone)
            if not allowed:
                return Response({
                    "status": False,
                    "message": message
                }, status=status.HTTP_429_TOO_MANY_REQUESTS)

            # 2. Create & Send OTP
            success, msg = create_and_send_otp(phone)
            if success:
                return Response({
                    "status": True,
                    "message": msg
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "status": False,
                    "message": msg
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(views.APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            phone = serializer.validated_data['phone']
            otp = serializer.validated_data['otp']

            # 1. Verify OTP
            is_valid, message = verify_otp_logic(phone, otp)
            if not is_valid:
                return Response({
                    "status": False,
                    "message": message
                }, status=status.HTTP_400_BAD_REQUEST)

            # 2. Login / Register User
            # Check if user exists, else create
            user, created = User.objects.get_or_create(
                phone=phone,
                defaults={
                    'username': f"user_{phone}",
                    'role': 'CITIZEN' # Default role
                }
            )

            # 3. Generate JWT
            refresh = RefreshToken.for_user(user)

            return Response({
                "status": True,
                "message": "OTP Verified Successfully",
                "token": str(refresh.access_token),
                "refresh": str(refresh),
                "user_id": user.id,
                "is_new_user": created
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
