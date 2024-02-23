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
                    'is_superUser': user.is_superuser
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


@api_view(['POST'])
@permission_classes([IsAdminUser])
def reset_password_by_admin(request):
    username = request.data.get('username')
    new_password = request.data.get('new_password')

    try:
        user = User.objects.get(username=username)
        user.set_password(new_password)
        user.save()
        return Response({'success': 'Senha redefinida com sucesso.'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'Usuário não encontrado.'}, status=status.HTTP_400_BAD_REQUEST)
