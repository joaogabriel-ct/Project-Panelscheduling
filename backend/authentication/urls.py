from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    )
from authentication.views import (
     ValidateTokenView,
     UserViewSet,
     UserRetriveUpdateDestroyView
     )


urlpatterns = [
    path('login/', TokenObtainPairView.as_view(),
         name="Login"),
    path('refresh/', TokenRefreshView.as_view(),
         name='Refresh'),
    path('token/validated/', ValidateTokenView.as_view(),
         name='Validated_token'),
    path('user/', UserViewSet.as_view(),
         name='Create-user'),
    path('user/<int:pk>/', UserRetriveUpdateDestroyView.as_view(),
         name='Edit-User')
]
