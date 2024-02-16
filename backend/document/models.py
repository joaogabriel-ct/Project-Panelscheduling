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
    document = models.FileField(upload_to='temp_arquivos/')
    id_user = models.ForeignKey(User, on_delete=models.CASCADE,
                                related_name='User_scheduled_document')
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name
