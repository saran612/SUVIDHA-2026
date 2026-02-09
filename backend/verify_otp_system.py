
import os
import django
import sys
import time

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dotenv import load_dotenv
load_dotenv()
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from rest_framework.test import APIClient
from apps.authentication.models import PhoneOTP
from django.utils import timezone

client = APIClient()

def test_otp_system():
    if len(sys.argv) > 1:
        phone = sys.argv[1]
    else:
        phone = input("Enter Phone Number to verify: ").strip()
    
    if not phone:
        phone = "7200136206"
        print(f"No input provided. Using default: {phone}")

    print(f"--- Starting OTP Verification for {phone} ---")

    # Clear OLD OTPs for this phone to start fresh
    PhoneOTP.objects.filter(phone=phone).delete()

    # 1. Send OTP (Attempt 1)
    print("\n1. Requesting OTP (1st attempt)...")
    res1 = client.post('/api/v1/auth/send-otp/', {'phone': phone})
    print(f"Status: {res1.status_code}, Msg: {res1.data}")
    
    if res1.status_code != 200:
        print("FAILED: First OTP request failed.")
        return

    # 2. Rate Limit Check (Attempt 2 - Immediate)
    print("\n2. Requesting OTP (2nd attempt - Immediate)...")
    res2 = client.post('/api/v1/auth/send-otp/', {'phone': phone})
    print(f"Status: {res2.status_code}, Msg: {res2.data}")

    if res2.status_code == 429:
        print("SUCCESS: Rate limit (60s rule) working.")
    else:
        print("FAILED: Rate limit check failed. Should be 429.")

    # 3. Verify OTP
    # Prompt user for OTP
    print("\n--- Check your phone/logs for OTP ---")
    otp_code = input(f"Enter OTP sent to {phone}: ").strip()
    
    # Fallback for empty input (Dev convenience)
    if not otp_code:
        print("No input. Fetching from DB for convenience...")
        otp_obj = PhoneOTP.objects.filter(phone=phone).order_by('-created_at').first()
        otp_code = otp_obj.otp
        print(f"Fetched Valid OTP from DB: {otp_code}")

    print("\n3. Verifying OTP...")
    res3 = client.post('/api/v1/auth/verify-otp/', {'phone': phone, 'otp': otp_code})
    print(f"Status: {res3.status_code}, Msg: {res3.data}")

    if res3.status_code == 200 and 'token' in res3.data:
        print("SUCCESS: OTP Verified and Token received.")
    else:
        print("FAILED: OTP Verification failed.")

    # 4. Verify Replay Attack (Using same OTP again)
    print("\n4. Verifying OTP Again (Replay Attack)...")
    res4 = client.post('/api/v1/auth/verify-otp/', {'phone': phone, 'otp': otp_code})
    print(f"Status: {res4.status_code}, Msg: {res4.data}")

    if res4.status_code == 400:
         print("SUCCESS: Replay attack prevented (Invalid OTP).")
    else:
         print("FAILED: Replay attack allowed.")

if __name__ == "__main__":
    test_otp_system()
