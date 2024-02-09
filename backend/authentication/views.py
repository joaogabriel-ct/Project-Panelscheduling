from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework import generics


class ValidateTokenView(APIView):
    permission_classes = [IsAuthenticated]

    # Validate user data
    def get(self, request):
        user = request.user
        return Response({
            'data': {
                'user': {
                    'username': user.username,
                    'id': user.id,
                    }
                }
        })


class UserViewSet(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserRetriveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'pk'
