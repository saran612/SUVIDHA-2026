from django.urls import path
from .views import ServiceContentView, FAQContentView

urlpatterns = [
    path('services/<str:language>/', ServiceContentView.as_view(), name='service-content'),
    path('faq/<str:language>/', FAQContentView.as_view(), name='faq-content'),
]
