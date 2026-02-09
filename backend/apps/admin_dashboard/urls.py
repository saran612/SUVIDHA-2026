from django.urls import path
from .views import DashboardStatsView

urlpatterns = [
    path('dashboard/stats/', DashboardStatsView.as_view(), name='admin-stats'),
    # Add other report endpoints
]
