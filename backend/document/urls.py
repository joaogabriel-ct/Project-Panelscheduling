from django.urls import path
from .views import DocumentUploadView, DocumentListView

urlpatterns = [
    path('upload/', DocumentUploadView.as_view(),
         name='api_document_upload'),
    path('list/', DocumentListView.as_view(),
         name='api_document_list'),
]
