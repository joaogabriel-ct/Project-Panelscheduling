from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include('authentication.urls')),
    path('api/v1/', include('schedule.urls')),
    path('api/v1/', include('document.urls'))
]
