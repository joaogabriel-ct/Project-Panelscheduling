# Generated by Django 5.0.2 on 2024-02-17 14:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('schedule', '0010_alter_schedulestatus_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='schedule',
            name='limit',
            field=models.IntegerField(default=100000),
        ),
    ]
