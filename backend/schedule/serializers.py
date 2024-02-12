from rest_framework import serializers
from .models import Schedule, ScheduleStatus
from document.serializers import DocumentSerializer


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
                                           source='status')
    DOCUMENT = DocumentSerializer(read_only=True,
                                  source='id_document')

    class Meta:
        model = Schedule
        fields = [
            'id',
            'id_user',
            'id_document',
            'DOCUMENT',
            'campaign_name',
            'schedule_date',
            'hour_schedule',
            'created_at',
            'STATUS_JSON'
        ]
