from django.contrib import admin
from .models import Schedule, ScheduleStatus, Telefone, AgendamentoLimite


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'id_user',
        'campaign_name',
        'message',
        'link',
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


@admin.register(Telefone)
class TelefoneAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'numero',
        'appointment_id'
    )


@admin.register(AgendamentoLimite)
class AgendamentoLimiteAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'data',
        'limite',
        'agendados'
    )
