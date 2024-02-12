from rest_framework import serializers
from .models import Document


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = [
            "id",
            "document",
            "id_user",
            "name",
            "number",
            "number_valid",
            "number_invalid",
            "number_blockeds",
        ]
