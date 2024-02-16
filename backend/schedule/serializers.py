from rest_framework import serializers
from .models import Schedule, ScheduleStatus, Telefone
from document.serializers import DocumentSerializer
from django.contrib.auth.models import User


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
                  'created_at', 'STATUS', 'telefones', 'number', 'number_valid', 'number_invalid']

    def get_telefones(self, obj):
        telefones_qs = obj.schedule_numbers.all()
        return [telefone.numero for telefone in telefones_qs]

    def update(self, instance, validated_data):

        status_data = validated_data.pop('STATUS', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if status_data:
            if instance.status:
                status_serializer = ScheduleStatusSerializer(
                    instance.status,
                    data=status_data,
                    partial=True)
            else:
                status_serializer = ScheduleStatusSerializer(data=status_data)
            if status_serializer.is_valid(raise_exception=True):
                status_instance = status_serializer.save()
                instance.status = status_instance
        reported_file = self.context.get('request').FILES.get('report')
        if reported_file:
            if not instance.status:
                status_instance = ScheduleStatus.objects.create()
                instance.status = status_instance
            instance.status.report = reported_file
            instance.status.save()
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
