from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
   openapi.Info(
      title="SUVIDHA Kiosk API",
      default_version='v1',
      description="API documentation for SUVIDHA Smart City Kiosk Platform",
      terms_of_service="https://www.suvidha.gov.in/terms/",
      contact=openapi.Contact(email="admin@suvidha.gov.in"),
      license=openapi.License(name="Government of India Open License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API V1 Routes
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/user/', include('apps.user_management.urls')),
    path('api/v1/billing/', include('apps.billing.urls')),
    path('api/v1/payment/', include('apps.payments.urls')),
    path('api/v1/grievance/', include('apps.grievances.urls')),
    path('api/v1/service/', include('apps.service_requests.urls')),
    path('api/v1/notifications/', include('apps.notifications.urls')),
    path('api/v1/content/', include('apps.content.urls')),
    path('api/v1/admin/', include('apps.admin_dashboard.urls')),

    # Documentation
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Health Check
    path('api/health/', lambda request: __import__('django.http').JsonResponse({"status": "ok"}), name='health_check'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
