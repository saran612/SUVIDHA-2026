from rest_framework import generics, permissions
from rest_framework_api_key.permissions import HasAPIKey
from .serializers import UserSerializer, UserPreferenceSerializer, UserCreateSerializer, LoginSerializer, VerifyLoginOTPSerializer
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from utils.otp_service import OTPService
from django.db.models import Q
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserPreferencesView(generics.UpdateAPIView):
    serializer_class = UserPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class UserCreateAPIView(generics.CreateAPIView):
    serializer_class = UserCreateSerializer
    permission_classes = [HasAPIKey]

class SendLoginOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier']
            
            # Find user by phone OR consumer number
            user = User.objects.filter(
                Q(phone=identifier) | Q(consumer_number=identifier)
            ).first()

            if not user:
                return Response({
                    "status": False,
                    "message": "User not found with this identifier."
                }, status=status.HTTP_404_NOT_FOUND)

            # Generate and Send OTP
            try:
                otp_code = OTPService.create_otp(user)
                return Response({
                    "status": True,
                    "message": f"OTP sent successfully to {user.phone}."
                }, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({
                    "status": False,
                    "message": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyLoginOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyLoginOTPSerializer(data=request.data)
        if serializer.is_valid():
            identifier = serializer.validated_data['identifier']
            otp = serializer.validated_data['otp']

            user = User.objects.filter(
                Q(phone=identifier) | Q(consumer_number=identifier)
            ).first()

            if not user:
                return Response({
                    "status": False,
                    "message": "User not found."
                }, status=status.HTTP_404_NOT_FOUND)

            if OTPService.verify_otp(user, otp):
                # Generate JWT
                refresh = RefreshToken.for_user(user)
                return Response({
                    "status": True,
                    "message": "Login Successful",
                    "token": str(refresh.access_token),
                    "refresh": str(refresh),
                    "user": {
                        "id": user.id,
                        "username": user.username,
                        "role": user.role,
                        "phone": user.phone,
                        "consumer_number": user.consumer_number
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "status": False,
                    "message": "Invalid or Expired OTP."
                }, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


