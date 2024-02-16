from django.urls import path
from . import views

urlpatterns = [
    path('agendamento/', views.ScheduleViewSet.as_view(),
         name='List-Schedule'),
    path('agendado/<int:pk>/',
         views.ScheduleRetriveUpdateDestroyView.as_view(),
         name='Schedule-detail-view'),
    path('status/agendamento/', views.ScheduleStatusViewSet.as_view(),
         name='List-Schedule'),
    path('status/agendado/<int:pk>/',
         views.ScheduleStatusRetriveUpdateDestroyView.as_view(),
         name='Schedule-detail-view'),
    path('telefones/',
         views.TelefoneListCreate.as_view(),
         name='list-telefone'),
    path('download-csv/<int:schedule_id>/',
         views.GenerateCSVForScheduleView.as_view(),
         name='download-csv'),
]
