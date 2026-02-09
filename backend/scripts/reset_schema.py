import os
import django
from django.db import connection
from dotenv import load_dotenv

load_dotenv()
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

def wipe_schema():
    # Enable autocommit to ensure DDL statements execute immediately
    connection.ensure_connection()
    connection.set_autocommit(True)
    
    with connection.cursor() as cursor:
        print("Dropping schema public...")
        cursor.execute("DROP SCHEMA IF EXISTS public CASCADE;")
        print("Creating schema public...")
        cursor.execute("CREATE SCHEMA public;")
        print("Schema public wiped and recreated.")

if __name__ == "__main__":
    wipe_schema()
