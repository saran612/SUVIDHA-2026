
import random
from datetime import timedelta
from django.utils import timezone
from django.conf import settings
from .models import PhoneOTP
from twilio.rest import Client
import logging

logger = logging.getLogger(__name__)

def generate_otp():
    """Generates a 6-digit numeric OTP."""
    return str(random.randint(100000, 999999))

def send_otp_sms(phone, otp):
    """Sends OTP via Twilio SMS. Falls back to logging if creds are missing."""
    try:
        account_sid = settings.TWILIO_ACCOUNT_SID
        auth_token = settings.TWILIO_AUTH_TOKEN
        twilio_phone = settings.TWILIO_PHONE_NUMBER

        if account_sid and auth_token and twilio_phone:
            client = Client(account_sid, auth_token)
            message = client.messages.create(
                body=f"Your Verification Code is {otp}. Expires in {settings.OTP_EXPIRY_MINUTES} minutes.",
                from_=twilio_phone,
                to=phone
            )
            logger.info(f"SMS Sent to {phone}: SID {message.sid}")
            return True
        else:
            # Fallback for dev/testing without Twilio
            logger.warning("Twilio credentials missing. Logging OTP instead.")
            print(f"==========================================")
            print(f"[MOCK SMS] To: {phone} | OTP: {otp}")
            print(f"==========================================")
            return True
    except Exception as e:
        logger.error(f"Failed to send SMS to {phone}: {e}")
        return False

def check_spam(phone):
    """
    Prevents spamming:
    - Max 1 OTP per 60 seconds.
    - Max 3 requests per 10 minutes.
    """
    now = timezone.now()
    one_minute_ago = now - timedelta(seconds=60)
    ten_minutes_ago = now - timedelta(minutes=10)

    # Rule 1: 1 OTP per 60 sec
    last_otp = PhoneOTP.objects.filter(phone=phone).order_by('-created_at').first()
    if last_otp and last_otp.created_at > one_minute_ago:
        return False, "Please wait 60 seconds before requesting a new OTP."

    # Rule 2: Max 3 per 10 mins
    recent_otps_count = PhoneOTP.objects.filter(phone=phone, created_at__gte=ten_minutes_ago).count()
    if recent_otps_count >= 3:
        return False, "Too many attempts. Please try again after 10 minutes."

    return True, ""

def create_and_send_otp(phone):
    """Generates, saves, and sends OTP for a phone number."""
    otp = generate_otp()
    
    # Save to DB
    PhoneOTP.objects.create(phone=phone, otp=otp)
    
    # Send SMS
    sent = send_otp_sms(phone, otp)
    if sent:
        return True, "OTP sent successfully."
    return False, "Failed to send OTP via SMS."

def verify_otp_logic(phone, otp):
    """
    Verifies OTP:
    - Must exist and be unverified.
    - Must match.
    - Must not be expired (5 mins).
    """
    now = timezone.now()
    expiry_time = now - timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
    
    otp_obj = PhoneOTP.objects.filter(phone=phone, otp=otp, is_verified=False).order_by('-created_at').first()
    
    if not otp_obj:
        return False, "Invalid OTP or phone number."
    
    if otp_obj.created_at < expiry_time:
        return False, "OTP has expired."
    
    # Check if this is the LATEST OTP (optional strict security)
    last_otp = PhoneOTP.objects.filter(phone=phone).order_by('-created_at').first()
    if last_otp.id != otp_obj.id:
         # Decide if valid previous OTPs are allowed. Usually NO.
         return False, "This OTP is no longer valid. Please use the latest one."

    # Verify
    otp_obj.is_verified = True
    otp_obj.save()
    
    return True, "OTP verified successfully."
