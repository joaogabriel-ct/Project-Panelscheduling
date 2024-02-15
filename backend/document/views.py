from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import DocumentSerializer
from .models import Document
from rest_framework.permissions import IsAuthenticated


class DocumentUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        # Verifica se múltiplos arquivos foram enviados
        files = request.FILES.getlist('arquivoAgendamento')
        saved_files = []
        errors = []

        for file in files:
            data = request.data.copy()
            data['document'] = file
            serializer = DocumentSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                saved_files.append(serializer.data)
            else:
                errors.append(serializer.errors)

        if saved_files:
            return Response(saved_files, status=status.HTTP_201_CREATED)
        else:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)


class DocumentListView(ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Document.objects.all()
        else:
            return Document.objects.filter(id_user=user)
