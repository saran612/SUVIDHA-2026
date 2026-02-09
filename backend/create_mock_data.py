
import os
import django
import sys

from dotenv import load_dotenv

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
load_dotenv()
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from apps.user_management.models import CustomUser
from utils.otp_service import OTPService
from apps.user_management.models import OTPVerification
from django.utils import timezone

def create_mock_data():
    phone = "9876543210"
    consumer_number = "1234567890"
    username = "mock_citizen"

    print(f"Creating/Getting Mock User: {username}")
    user, created = CustomUser.objects.get_or_create(
        username=username,
        defaults={
            "phone": phone,
            "consumer_number": consumer_number,
            "role": CustomUser.Role.CITIZEN
        }
    )
    
    if not created:
        print(f"User already exists. Updating phone/consumer number.")
        user.phone = phone
        user.consumer_number = consumer_number
        user.save()

    print(f"User ID: {user.id}")
    print(f"Phone: {user.phone}")
    print(f"Consumer Number: {user.consumer_number}")

    print("\nGenerating OTP...")
    otp_code = OTPService.create_otp(user)
    print(f"Generated OTP: {otp_code}")

    print("\n--- VERIFICATION QUERY ---")
    print("You can verify this in Django Shell or another script using:")
    print(f"""
from apps.user_management.models import CustomUser
from utils.otp_service import OTPService

user = CustomUser.objects.get(username='{username}')
otp_code = '{otp_code}' 
is_valid = OTPService.verify_otp(user, otp_code)
print(f"Is OTP Valid? {{is_valid}}")
    """)

    # Verify immediately to show it works
    print("\n--- IMMEDIATE VERIFICATION TEST ---")
    is_valid = OTPService.verify_otp(user, otp_code)
    print(f"Self-Verification Result: {'SUCCESS' if is_valid else 'FAILED'}")

if __name__ == "__main__":
    try:
        create_mock_data()
    except Exception as e:
        print(f"Error: {e}")
