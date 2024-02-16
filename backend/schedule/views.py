from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import ScheduleSerializer, ScheduleStatusSerializer
from .serializers import TelefoneSerializer
from .models import Schedule, ScheduleStatus, Telefone
from rest_framework.permissions import IsAuthenticated
from django.views import View
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
import csv
from django.http import HttpResponse


def generate_csv_for_schedule(schedule_id):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = f'attachment; filename="telefones_schedule_{schedule_id}.csv"'

    writer = csv.writer(response)
    writer.writerow(['Número'])

    telefones = Telefone.objects.filter(appointment_id=schedule_id).values_list('numero', flat=True)
    for numero in telefones:
        writer.writerow([numero])

    return response


class GenerateCSVForScheduleView(View):
    @method_decorator(login_required)
    def get(self, request, schedule_id):
        return generate_csv_for_schedule(schedule_id)


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


class TelefoneListCreate(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TelefoneSerializer

    def get_queryset(self):
        """
        Este método retorna os telefones associados ao usuário, se necessário.
        """
        user = self.request.user
        return Telefone.objects.filter(appointment_id__id_user=user)

    def create(self, request, *args, **kwargs):
        schedule_id = request.data.get('scheduleId')
        telefones_data = request.data.get('telefones', [])
        try:
            schedule = Schedule.objects.get(pk=schedule_id, id_user=request.user)
        except Schedule.DoesNotExist:
            return Response({'error': 'Agendamento não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        # Processa cada número de telefone
        created_telefones = []
        for numero in telefones_data:
            serializer = self.get_serializer(
                data={
                 'appointment_id': schedule_id
                    })
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            created_telefones.append(serializer.data)

        return Response(created_telefones, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save()
