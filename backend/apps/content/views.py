from rest_framework import generics, permissions
from .models import ServiceContent, FAQContent
from .serializers import ServiceContentSerializer, FAQContentSerializer

class ServiceContentView(generics.ListAPIView):
    serializer_class = ServiceContentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        lang = self.kwargs.get('language', 'en')
        return ServiceContent.objects.filter(language=lang, is_active=True)

class FAQContentView(generics.ListAPIView):
    serializer_class = FAQContentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        lang = self.kwargs.get('language', 'en')
        return FAQContent.objects.filter(language=lang)
