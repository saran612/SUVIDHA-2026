from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from apps.user_management.models import CustomUser
from apps.grievances.models import Complaint
from apps.payments.models import Payment

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated] 
    # Add IsAdmin permission here if strictly for admin

    def get(self, request):
        data = {
            "total_users": CustomUser.objects.count(),
            "pending_complaints": Complaint.objects.filter(status='OPEN').count(),
            "total_revenue": 0 # Sum aggregation logic here
        }
        return Response(data)
