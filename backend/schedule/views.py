from rest_framework import generics
from .serializers import ScheduleSerializer, ScheduleStatusSerializer
from .models import Schedule, ScheduleStatus


class ScheduleViewSet(generics.ListCreateAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer


class ScheduleRetriveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer

    def get_serializer_context(self):
        """
        Garante que o contexto inclua o request.
        """
        return {'request': self.request}


class ScheduleStatusViewSet(generics.ListCreateAPIView):
    queryset = ScheduleStatus.objects.all()
    serializer_class = ScheduleStatusSerializer


class ScheduleStatusRetriveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ScheduleStatus.objects.all()
    serializer_class = ScheduleStatusSerializer
