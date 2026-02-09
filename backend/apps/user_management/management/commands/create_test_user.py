import random
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from apps.user_management.models import CustomUser

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates a test user with specified phone and consumer number'

    def add_arguments(self, parser):
        parser.add_argument('--phone', type=str, help='Phone number', required=True)
        parser.add_argument('--consumer', type=str, help='Consumer number', required=True)
        parser.add_argument('--username', type=str, help='Username (optional)', required=False)

    def handle(self, *args, **kwargs):
        phone = kwargs['phone']
        consumer = kwargs['consumer']
        username = kwargs.get('username') or f"testuser_{phone}"

        self.stdout.write(f"Creating/Updating user: {username} | Phone: {phone} | Consumer: {consumer}")

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'phone': phone,
                'consumer_number': consumer,
                'role': CustomUser.Role.CITIZEN
            }
        )

        if not created:
            user.phone = phone
            user.consumer_number = consumer
            user.save()
            self.stdout.write(self.style.WARNING(f"User {username} already existed. Updated details."))
        else:
            self.stdout.write(self.style.SUCCESS(f"User {username} created successfully."))

        # Display details
        self.stdout.write(f"ID: {user.id}")
        self.stdout.write(f"Phone: {user.phone}")
        self.stdout.write(f"Consumer Number: {user.consumer_number}")
