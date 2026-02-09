import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from dotenv import load_dotenv
load_dotenv()
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.user_management.models import OTPVerification
from django.core.management import call_command

User = get_user_model()
client = APIClient()
BASE_URL = "/api/v1/user/login"

def test_login_flow(identifier, type_name):
    print(f"\n--- Testing Login with {type_name}: {identifier} ---")

    # 1. Send OTP
    print(f"1. Requesting OTP for {identifier}...")
    response = client.post(f"{BASE_URL}/send-otp/", {"identifier": identifier}, format='json')
    print(f"Status: {response.status_code}")
    print(f"Response: {response.data}")
    
    if response.status_code != 200:
        print("FAILED: Send OTP request failed.")
        return

    # 2. Get OTP from DB
    print("\n2. Fetching OTP from DB...")
    if type_name == "Phone":
        user = User.objects.filter(phone=identifier).first()
    else:
        user = User.objects.filter(consumer_number=identifier).first()

    if not user:
        print("ERROR: User not found in DB!")
        return

    otp_obj = OTPVerification.objects.filter(user=user, is_verified=False).order_by('-created_at').first()
    if not otp_obj:
        print("ERROR: No OTP found in DB!")
        return
    
    otp_code = otp_obj.otp_code
    print(f"Fetched OTP: {otp_code}")

    # 3. Verify OTP
    print(f"\n3. Verifying OTP {otp_code}...")
    verify_response = client.post(f"{BASE_URL}/verify-otp/", {"identifier": identifier, "otp": otp_code}, format='json')
    print(f"Status: {verify_response.status_code}")
    print(f"Response: {verify_response.data}")

    if verify_response.status_code == 200 and 'token' in verify_response.data:
        print(f"SUCCESS: {type_name} Login Verified!")
    else:
        print(f"FAILED: {type_name} Login Verification failed.")

if __name__ == "__main__":
    # Ensure test user exists
    phone = "9988776655"
    consumer = "CN12345678"
    
    print("Creating Test User...")
    # call_command('create_test_user', phone=phone, consumer=consumer, username="verify_user")
    # Using the same logic as the command inside the script to avoid spawning sub-process if command not registered yet (though it should be)
    from apps.user_management.models import CustomUser
    user, created = User.objects.get_or_create(
        username="verify_user",
        defaults={'phone': phone, 'consumer_number': consumer, 'role': CustomUser.Role.CITIZEN}
    )
    if not created:
        user.phone = phone
        user.consumer_number = consumer
        user.save()
    
    test_login_flow(phone, "Phone")
    test_login_flow(consumer, "Consumer Number")
