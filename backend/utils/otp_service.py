import random
from django.utils import timezone
from datetime import timedelta
from django.conf import settings
from apps.user_management.models import OTPVerification

class OTPService:
    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))

    @staticmethod
    def create_otp(user, otp_type=OTPVerification.OtpType.LOGIN):
        otp_code = OTPService.generate_otp()
        expires_at = timezone.now() + timedelta(minutes=5) # 5 min expiry
        
        # Invalidate previous OTPs
        OTPVerification.objects.filter(user=user, is_verified=False).delete()
        
        otp_obj = OTPVerification.objects.create(
            user=user,
            otp_code=otp_code,
            otp_type=otp_type,
            expires_at=expires_at
        )
        
        # Mock SMS sending
        OTPService.send_sms(user.phone, otp_code)
        
        return otp_obj.otp_code

    @staticmethod
    def verify_otp(user, otp_code, otp_type=OTPVerification.OtpType.LOGIN):
        try:
            otp_record = OTPVerification.objects.get(
                user=user,
                otp_code=otp_code,
                otp_type=otp_type,
                is_verified=False
            )
        except OTPVerification.DoesNotExist:
            return False

        if otp_record.expires_at < timezone.now():
            return False
            
        otp_record.is_verified = True
        otp_record.save()
        return True

    @staticmethod
    def send_sms(phone, otp):
        # Integration point for SMS Gateway
        print(f"==========================================")
        print(f"SENDING SMS to {phone}: Your OTP is {otp}")
        print(f"==========================================")
        return True
