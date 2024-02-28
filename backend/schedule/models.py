from django.db import models
from django.contrib.auth.models import User
from document.models import Document
from django.db.models import F
import re
import datetime


class AgendamentoLimite(models.Model):
    data = models.DateField(unique=True)
    limite = models.IntegerField(default=100000)
    agendados = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.data} - Limite: {self.limite}"

    @classmethod
    def increment_agendados_for_date(cls, date, count):
        obj, created = cls.objects.get_or_create(data=date, defaults={'agendados': 0})
        obj.agendados = F('agendados') + count
        obj.save()

    @classmethod
    def limpar_limites_antigos(cls):
        """
        Remove os limites de agendamento que estão mais de um mês atrás.
        """
        um_mes_atras = datetime.date.today() - datetime.timedelta(days=30)
        cls.objects.filter(data__lt=um_mes_atras).delete()


"""
| status = STATUS da operação         |
| report = relátorio da operação      |
| reported = Json do que foi relatado |
"""


class ScheduleStatus(models.Model):
    status = models.CharField(max_length=50, default='Agendado')
    report = models.FileField(upload_to='reported/', null=True, blank=True)
    reported = models.JSONField(null=True, blank=True)

    def save(self, *args, **kwargs):

        if self.report:
            numero_de_mensagens = 0
            padrao = r"""Mensagem enviada para : (\d+) -
            (\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2})"""

            self.report.open('r')
            for linha in self.report:
                if re.search(padrao, linha):
                    numero_de_mensagens += 1
            self.report.close()
            self.reported = {"total_de_mensagens": numero_de_mensagens}

        super(ScheduleStatus, self).save(*args, **kwargs)


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
    created_at = models.DateTimeField(auto_now_add=True)
    id_user = models.ForeignKey(User,
                                on_delete=models.CASCADE,
                                related_name='user_scheduled')
    id_document = models.ForeignKey(Document, on_delete=models.CASCADE,
                                    related_name='doc_schedule')
    campaign_name = models.CharField(max_length=200, default='default_campaign')
    message = models.TextField(null=True, blank=True)
    link = models.URLField(null=True, blank=True)
    schedule_date = models.DateField(null=True, blank=True)
    hour_schedule = models.TimeField(auto_now_add=True, blank=False)
    status = models.ForeignKey(ScheduleStatus, on_delete=models.CASCADE,
                               related_name='schedule_status', null=True,
                               blank=True)
    number = models.IntegerField(default=0)
    number_valid = models.IntegerField(default=0)
    number_invalid = models.IntegerField(default=0)

    def __str__(self):
        return f"""
    {self.campaign_name} -
    {self.schedule_date} at
    {self.hour_schedule}"""


"""
| id = de cada numero                      |
| id_user = id_usuario                     |
| numbers = numeros                        |
"""


class Telefone(models.Model):
    numero = models.CharField(max_length=15)
    appointment_id = models.ForeignKey(Schedule, on_delete=models.CASCADE,
                                       related_name='schedule_numbers')

    def __str__(self):
        return self.numero
