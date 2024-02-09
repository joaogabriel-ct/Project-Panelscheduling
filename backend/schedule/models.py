from django.db import models
from django.contrib.auth.models import User

"""
| status = STATUS da operação         |
| report = relátorio da operação      |
| reported = Json do que foi relatado |
"""


class ScheduleStatus(models.Model):
    status = models.BooleanField()
    report = models.FileField(upload_to='reported/')
    reported = models.JSONField(null=True, blank=True)


"""
| id_lead = id do cliente                  |
| id_document = id do arquivo salvo        |
| campaing_name = nome da campanha         |
| scheduled_date = data do agendamento     |
| hour_schedule = hora que foi agendado    |
| created_at = Hora que foi criado         |
| status = status da operação              |
"""


class Schedule(models.Model):
    id_user = models.ForeignKey(User,
                                on_delete=models.CASCADE,
                                related_name='user_scheduled')
    campaign_name = models.CharField(max_length=200)
    schedule_date = models.DateField(null=True, blank=True)
    hour_schedule = models.TimeField(auto_now_add=True, blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.ForeignKey(ScheduleStatus, on_delete=models.CASCADE,
                               related_name='schedule_status')

    def __str__(self):
        return f"""
    {self.campaign_name} -
    {self.schedule_date} at
    {self.hour_schedule}"""
