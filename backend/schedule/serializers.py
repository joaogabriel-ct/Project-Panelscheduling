from rest_framework import serializers
from .models import Schedule, ScheduleStatus, Telefone, AgendamentoLimite
from document.serializers import DocumentSerializer
from django.contrib.auth.models import User
import json


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class ScheduleStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleStatus
        fields = ['id', 'status', 'report', 'reported']


class ScheduleSerializer(serializers.ModelSerializer):
    STATUS = ScheduleStatusSerializer(source='status', required=False)
    DOCUMENT = DocumentSerializer(source='id_document', read_only=True)
    USER = UserSerializer(source='id_user', read_only=True)
    telefones = serializers.SerializerMethodField()

    class Meta:
        model = Schedule
        fields = ['id', 'id_user', 'USER', 'id_document', 'DOCUMENT',
                  'campaign_name', 'schedule_date', 'hour_schedule',
                  'created_at', 'STATUS', 'telefones', 'number',
                  'number_valid', 'number_invalid']

    def create(self, validated_data):
        # Normal creation logic
        schedule_instance = super().create(validated_data)
        telefone_count = schedule_instance.schedule_numbers.count()
        AgendamentoLimite.increment_agendados_for_date(schedule_instance.schedule_date, telefone_count)
        return schedule_instance

    def get_telefones(self, obj):
        telefones_qs = obj.schedule_numbers.all()
        return [telefone.numero for telefone in telefones_qs]

    def update(self, instance, validated_data):
        status_data = validated_data.pop('status', None)  # Nota: A chave deve coincidir com a representação do campo no validated_data

        # Atualizar campos simples diretamente
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if status_data:
            # Se a instância de Schedule já tem um status associado, atualize esse status
            if instance.status:
                status_serializer = ScheduleStatusSerializer(instance.status, data=status_data, partial=True)
            else:
                # Caso contrário, crie uma nova instância de ScheduleStatus
                status_serializer = ScheduleStatusSerializer(data=status_data)
            
            # Verifica se o serializer do status é válido e salva a instância
            if status_serializer.is_valid(raise_exception=True):
                status_instance = status_serializer.save()
                instance.status = status_instance

        instance.save()
        return instance


class TelefoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = Telefone
        fields = [
            'id',
            'numero',
            'appointment_id',
            ]
