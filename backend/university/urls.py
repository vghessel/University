from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1.0.0/', include('deloitteapp.urls'), name='deloitteapp_urls'),
    path('api/v1.0.0/', include('docs.urls'), name='docs_urls'),
    #path('api/v1.0.0/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    #path('api/v1.0.0/token_refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
