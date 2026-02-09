from django.urls import path
from .views import FetchBillView, BillHistoryView, BillDetailView

urlpatterns = [
    path('fetch/<str:consumer_number>/', FetchBillView.as_view(), name='fetch-bill'),
    path('history/', BillHistoryView.as_view(), name='bill-history'),
    path('details/<str:bill_id>/', BillDetailView.as_view(), name='bill-details'),
]
