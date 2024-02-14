from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Document
import pandas as pd


@receiver(pre_save, sender=Document)
def preprocess_file(sender, instance, **kwargs):
    # Verifica se o campo 'document' foi alterado
    if instance.document and instance.document.file:
        filename = instance.document.name
        if filename.endswith('.xlsx'):
            # Para document Excel
            excel_data = pd.read_excel(instance.document.file)
            linhas_duplicadas = excel_data.duplicated().sum()
            excel_data.drop_duplicates(inplace=True)
            total_linhas = len(excel_data)
            numeros_validos = 0
            numeros_invalidos = []
            for index, row in excel_data.iterrows():
                numero = str(row['numero_celular'])
                if len(numero) == 11:
                    numeros_validos += 1
                else:
                    numeros_invalidos.append(numero)
            instance.number = total_linhas
            instance.linhas_duplicadas = linhas_duplicadas
            instance.number_valid = numeros_validos
            instance.number_invalid = len(numeros_invalidos)
        elif filename.endswith('.csv'):
            # Para arquivo CSV
            csv_data = pd.read_csv(instance.document.file)
            linhas_duplicadas = csv_data.duplicated().sum()
            csv_data.drop_duplicates(inplace=True)
            total_linhas = len(csv_data)
            numeros_validos = 0
            numeros_invalidos = []

            for index, row in csv_data.iterrows():
                numero = str(row.get('numero_celular'))
                if len(numero) == 11:
                    numeros_validos += 1
                else:
                    numeros_invalidos.append(numero)

            instance.number = total_linhas
            instance.number_valid = numeros_validos
            instance.number_invalid = len(numeros_invalidos)
            instance.number_blockeds = linhas_duplicadas
