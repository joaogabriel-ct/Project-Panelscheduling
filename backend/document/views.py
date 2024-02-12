from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import DocumentSerializer
from .models import Document


class DocumentUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        # Verifica se múltiplos arquivos foram enviados
        files = request.FILES.getlist('arquivoAgendamento')
        saved_files = []
        errors = []

        for file in files:
            # Cria uma cópia do QueryDict porque é imutável
            data = request.data.copy()
            # Atualiza o QueryDict com o arquivo atual
            data['document'] = file
            # Opcional: Adiciona/Atualiza outros campos se necessário
            # data['id_user'] = <id_do_usuario>
            # data['name'] = file.name ou outro valor

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
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
