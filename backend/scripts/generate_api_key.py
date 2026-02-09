
import os
import sys
import django
from dotenv import load_dotenv

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), '.env'))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.development")
django.setup()

from rest_framework_api_key.models import APIKey

def generate_key():
    name = "Kiosk-Access-Key"
    try:
        api_key, key = APIKey.objects.create_key(name=name)
        print(f"Name: {name}")
        print(f"API Key: {key}")
    except Exception as e:
        print(f"Error creating key: {e}")

if __name__ == "__main__":
    generate_key()
