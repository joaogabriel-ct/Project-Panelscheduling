# Generated by Django 5.0.2 on 2024-02-09 00:29

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='MyUser',
        ),
    ]
