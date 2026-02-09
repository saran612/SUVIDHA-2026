from django.urls import path
from .views import SubmitGrievanceView, GrievanceListView, TrackGrievanceView

urlpatterns = [
    path('submit/', SubmitGrievanceView.as_view(), name='grievance-submit'),
    path('list/', GrievanceListView.as_view(), name='grievance-list'),
    path('track/<str:complaint_id>/', TrackGrievanceView.as_view(), name='grievance-track'),
]
