# schedule/management/commands/limpar_limites_antigos.py
from django.core.management.base import BaseCommand
from schedule.models import AgendamentoLimite


class Command(BaseCommand):
    help = 'Limpa os limites de agendamento antigos.'

    def handle(self, *args, **kwargs):
        AgendamentoLimite.limpar_limites_antigos()
        self.stdout.write(self.style.SUCCESS(
            '''Limites de agendamento antigos removidos com sucesso.'''))
