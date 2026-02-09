from rest_framework import generics, permissions
from .models import Complaint
from .serializers import ComplaintSerializer
import uuid

class SubmitGrievanceView(generics.CreateAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        cid = f"CMP-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(user=self.request.user, complaint_id=cid)

class GrievanceListView(generics.ListAPIView):
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Complaint.objects.filter(user=self.request.user)

class TrackGrievanceView(generics.RetrieveAPIView):
    queryset = Complaint.objects.all()
    serializer_class = ComplaintSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'complaint_id'
