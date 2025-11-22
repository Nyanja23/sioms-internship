from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from django.http import HttpResponse

def root(request):
    return HttpResponse("SIOMS Backend is live! APIs at /api/")


urlpatterns = [
    path('', root, name='root'),
    path('admin/', admin.site.urls),
    path('api/token/',TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('products.urls')),
    path('api/', include('orders.urls')),
    path('api/', include('customers.urls')),
]
