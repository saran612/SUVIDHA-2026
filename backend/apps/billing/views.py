from rest_framework import generics, permissions
from .models import Bill
from .serializers import BillSerializer

class FetchBillView(generics.ListAPIView):
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        consumer_number = self.kwargs.get('consumer_number')
        # In MVP, we filter local DB. In prod, we might query upstream.
        return Bill.objects.filter(consumer_number=consumer_number)

class BillHistoryView(generics.ListAPIView):
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bill.objects.filter(consumer_number__in=self.request.user.electricity_accounts.values('consumer_number'))

class BillDetailView(generics.RetrieveAPIView):
    queryset = Bill.objects.all()
    serializer_class = BillSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'bill_id'
