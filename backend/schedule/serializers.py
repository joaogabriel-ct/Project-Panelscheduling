from rest_framework import serializers
from .models import Schedule, ScheduleStatus


class ScheduleStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScheduleStatus
        fields = [
            'status',
            'report',
            'reported'
        ]


class ScheduleSerializer(serializers.ModelSerializer):
    STATUS_JSON = ScheduleStatusSerializer(read_only=True,
                                           source='ScheduleStatus_id')

    class Meta:
        model = Schedule
        fields = [
            'id',
            'id_user',
            'id_document',
            'campaing_name',
            'hour_schedule',
            'created_at',
            'status',
            'STATUS_JSON'
        ]
