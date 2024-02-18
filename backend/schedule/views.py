from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .serializers import ScheduleSerializer, ScheduleStatusSerializer
from .serializers import TelefoneSerializer
from .models import Schedule, ScheduleStatus, Telefone, AgendamentoLimite
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from datetime import datetime
from django.db.models import Sum


class VerificarLimiteView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        data_solicitada_str = request.query_params.get('data')
        if not data_solicitada_str:
            return Response({
                "erro": "Por favor, forneça uma data no formato 'YYYY-MM-DD'."
                }, status=status.HTTP_400_BAD_REQUEST)

        try:
            data_solicitada = datetime.strptime(data_solicitada_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({
                "erro": "Formato de data inválido. Use 'YYYY-MM-DD'."
                }, status=status.HTTP_400_BAD_REQUEST)

        # Tentativa de obter o objeto AgendamentoLimite para a data solicitada
        # Se não existir, é considerado que não há limite definido e a data está livre
        try:
            limite = AgendamentoLimite.objects.get(data=data_solicitada)
        except AgendamentoLimite.DoesNotExist:
            return Response({
                "data": data_solicitada_str,
                "mensagem": "Data livre para agendamentos. Não há limite definido."
            })

        agendamentos = Schedule.objects.filter(schedule_date=data_solicitada)
        total_numeros = 0
        for agendamento in agendamentos:
            total_numeros += agendamento.schedule_numbers.count()

        # Se não houver agendamentos para a data, considera-se que a data está livre
        if total_numeros == 0:
            return Response({
                "data": data_solicitada_str,
                "limite": limite.limite,
                "mensagem": "Data livre para agendamentos."
            })
        else:
            return Response({
                "data": data_solicitada_str,
                "limite": limite.limite,
                "total_numeros": total_numeros
            })


class AjustarLimiteView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        data = request.data.get('data')
        novo_limite = request.data.get('limite')
        objeto, criado = AgendamentoLimite.objects.get_or_create(
            data=data, defaults={'limite': novo_limite})
        if not criado:
            objeto.limite = novo_limite
            objeto.save()
        return Response({
            'status': 'sucesso',
            'data': data,
            'novo_limite': novo_limite})


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
            schedule = Schedule.objects.get(
                pk=schedule_id,
                id_user=request.user)
        except Schedule.DoesNotExist:
            return Response({'error': 'Agendamento não encontrado.'},
                            status=status.HTTP_404_NOT_FOUND)
        created_telefones = []
        for numero in telefones_data:
            serializer = self.get_serializer(
                data={
                 'appointment_id': schedule_id,
                 'numero': numero,
                    })
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            created_telefones.append(serializer.data)

        return Response(created_telefones, status=status.HTTP_201_CREATED)

    def perform_create(self, serializer):
        serializer.save()
