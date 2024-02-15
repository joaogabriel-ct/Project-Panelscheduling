from rest_framework import generics
from .serializers import ScheduleSerializer, ScheduleStatusSerializer
from .models import Schedule, ScheduleStatus
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated


class ScheduleViewSet(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        """
        Sobrescreve o método para retornar agendamentos
        baseados no tipo de usuário.
        """
        user = self.request.user
        if user.is_authenticated:
            if user.is_superuser:
                return (
                    Schedule.objects.all()
                )
            else:
                return Schedule.objects.filter(
                    id_user=user
                )
        return Schedule.objects.none()


class ScheduleRetriveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ScheduleSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_superuser:
                return Schedule.objects.all()
            else:
                return Schedule.objects.filter(id_user=user)
        return Schedule.objects.none()

    def get_serializer_context(self):
        return {'request': self.request}


class ScheduleStatusViewSet(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ScheduleStatusSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_superuser:
                return ScheduleStatus.objects.all()
            else:
                return ScheduleStatus.objects.filter(id_user=user)
        return ScheduleStatus.objects.none()


class ScheduleStatusRetriveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ScheduleStatusSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_superuser:
                return ScheduleStatus.objects.all()
            else:
                return ScheduleStatus.objects.filter(schedule__user=user)
        return ScheduleStatus.objects.none()
