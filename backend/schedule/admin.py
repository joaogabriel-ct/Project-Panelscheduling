from django.contrib import admin
from .models import Schedule, ScheduleStatus


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'id_user',
        'campaign_name',
        'schedule_date',
        'hour_schedule',
        'created_at',
        'status'
    )


@admin.register(ScheduleStatus)
class ScheduleStatusAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'status',
        'report',
        'reported'
    )