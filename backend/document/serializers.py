from rest_framework import serializers
from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    document_url = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            "id",
            'document',
            "document_url",
            "id_user",
            "name",
        ]

    def get_document_url(self, obj):
        if obj.document:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.document.url)
            else:
                return obj.document.url
        return None
