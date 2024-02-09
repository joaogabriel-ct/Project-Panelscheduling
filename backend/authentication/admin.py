from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin


class UserAdmin(BaseUserAdmin):
    # A lista de valores a serem exibidos na listagem de usuários
    list_display = ('email', 'first_name', 'last_name',
                    'is_active', 'date_joined', 'is_staff')
    # A lista de campos a serem usados nas buscas na listagem de usuários
    search_fields = ('email', 'first_name', 'last_name')
    # A ordem de classificação dos usuários na listagem
    ordering = ('email',)
    # Campos a serem exibidos na edição do usuário, com seções personalizadas
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser',
                                   'groups', 'user_permissions')}),
        ('Datas Importantes', {'fields': ('last_login', 'date_joined')}),
    )
    # Campos a serem usados no formulário de criação de um novo usuário
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
