from django.db import models
from authentication.models import User

"""
   | Criação de como salvar o documento   |
   | id_user = quem salvou o doc          |
   | appointment = id do agendamento      |
   | name = nome do documento             |
   | number = numero de linhas            |
   | number_valid = numeros validos       |
   | number_invalid = numeros invalidos   |
   | number_blockeds = numeros Bloqueados |
   | numbers_invalids = numeros Invalidos |
"""


class Document(models.Model):
    document = models.FileField(upload_to='document/')
    id_user = models.ForeignKey(User, on_delete=models.CASCADE,
                                related_name='User_scheduled_document')
    appointment = models.ForeignKey('schedule.Schedule',
                                    on_delete=models.CASCADE,
                                    related_name='related_documents',
                                    null=True, blank=True)
    name = models.CharField(max_length=200)
    number = models.IntegerField(null=True, blank=True)
    number_valid = models.IntegerField(null=True, blank=True)
    number_invalid = models.IntegerField(null=True, blank=True)
    number_blockeds = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name
