# Generated by Django 5.0.2 on 2024-02-12 13:26

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('document', '0002_remove_document_numbers_invalids_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='document',
            name='appointment',
        ),
    ]
