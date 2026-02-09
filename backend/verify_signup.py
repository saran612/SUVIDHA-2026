
import os
import django
import sys
from dotenv import load_dotenv

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
load_dotenv()
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from rest_framework.test import APIClient
from apps.user_management.models import CustomUser
from apps.user_management.models import OTPVerification
import random

def verify_signup_flow():
    client = APIClient()
    
    # Generate random phone
    new_phone = f"99{random.randint(10000000, 99999999)}"
    print(f"Testing Sign Up with new phone: {new_phone}")

    # 1. Request OTP (Sign Up)
    print("\n--- Step 1: Request OTP ---")
    response = client.post('/api/v1/auth/request-otp/', {'identifier': new_phone}, format='json')
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.data}")
    
    if response.status_code != 200:
        print("FAILED: Request OTP failed")
        return

    # Verify User Created
    user = CustomUser.objects.filter(phone=new_phone).first()
    if user:
        print(f"SUCCESS: User created! ID: {user.id}, Username: {user.username}, Role: {user.role}")
    else:
        print("FAILED: User was NOT created.")
        return

    # Verify OTP generated
    otp = OTPVerification.objects.filter(user=user, is_verified=False).order_by('-created_at').first()
    if otp:
        print(f"SUCCESS: OTP generated: {otp.otp_code}")
    else:
        print("FAILED: No OTP found.")
        return

    # 2. Verify OTP (Login)
    print("\n--- Step 2: Verify OTP ---")
    verify_response = client.post('/api/v1/auth/verify-otp/', {
        'identifier': new_phone,
        'otp': otp.otp_code
    }, format='json')

    print(f"Status Code: {verify_response.status_code}")
    print(f"Response: {verify_response.json()}")

    if verify_response.status_code == 200:
        print("SUCCESS: Login verified!")
    else:
        print("FAILED: OTP Verification failed")

if __name__ == "__main__":
    try:
        verify_signup_flow()
    except Exception as e:
        print(f"Error: {e}")
