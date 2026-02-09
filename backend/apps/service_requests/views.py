from rest_framework import generics, permissions
from .models import ServiceRequest
from .serializers import ServiceRequestSerializer
import uuid

class SubmitServiceRequestView(generics.CreateAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        rid = f"SR-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(user=self.request.user, request_id=rid)

class ServiceRequestListView(generics.ListAPIView):
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ServiceRequest.objects.filter(user=self.request.user)

class ServiceStatusView(generics.RetrieveAPIView):
    queryset = ServiceRequest.objects.all()
    serializer_class = ServiceRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'request_id'
