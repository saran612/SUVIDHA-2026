from django.urls import path
from .views import SubmitServiceRequestView, ServiceRequestListView, ServiceStatusView

urlpatterns = [
    path('request/', SubmitServiceRequestView.as_view(), name='service-request-submit'),
    path('list/', ServiceRequestListView.as_view(), name='service-request-list'),
    path('status/<str:request_id>/', ServiceStatusView.as_view(), name='service-request-status'),
]
