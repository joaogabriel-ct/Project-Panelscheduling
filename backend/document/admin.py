from django.contrib import admin
from .models import Document


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'id_user',
        'appointment',
        'name',
        'number',
        'number_valid',
        'number_invalid',
        'number_blockeds',
    ]
