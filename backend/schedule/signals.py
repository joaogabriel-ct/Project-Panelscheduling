from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Telefone, Schedule


# Signal para atualizar a contagem após salvar um Telefone
@receiver(post_save, sender=Telefone)
def update_phone_count_on_save(sender, instance, **kwargs):
    schedule = instance.appointment_id
    schedule.number = schedule.schedule_numbers.count()
    schedule.number_valid = schedule.schedule_numbers.filter(
        numero__regex=r'^\d{11}$').count()
    schedule.number_invalid = schedule.number - schedule.number_valid
    schedule.save()

# Signal para atualizar a contagem após deletar um Telefone
@receiver(post_delete, sender=Telefone)
def update_phone_count_on_delete(sender, instance, **kwargs):
    schedule = instance.appointment_id
    schedule.number = schedule.schedule_numbers.count()
    schedule.number_valid = schedule.schedule_numbers.filter(
        numero__regex=r'^\d{11}$').count()
    schedule.number_invalid = schedule.number - schedule.number_valid
    schedule.save()