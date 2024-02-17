from rest_framework import serializers
from .models import Schedule, ScheduleStatus, Telefone
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
        fields = ['status', 'report', 'reported']


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

    def get_telefones(self, obj):
        telefones_qs = obj.schedule_numbers.all()
        return [telefone.numero for telefone in telefones_qs]

    def update(self, instance, validated_data):
        # Trata o campo STATUS que é passado como uma string JSON
        status_data = validated_data.pop('STATUS', None)
        if status_data:
            # Converte a string JSON para um dicionário Python
            status_data = json.loads(status_data)
            # Verifica se o instance já tem um status associado
            if instance.status:
                # Atualiza o status existente
                status_serializer = ScheduleStatusSerializer(
                    instance.status,
                    data=status_data,
                    partial=True)
            else:
                # Cria um novo status
                status_serializer = ScheduleStatusSerializer(data=status_data)
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
