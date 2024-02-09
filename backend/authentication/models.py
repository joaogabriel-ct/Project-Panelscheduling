from django.contrib.auth.models import User


def create_user_with_email(email, password, first_name, last_name):
    # Verifica se já existe um usuário com esse e-mail
    if User.objects.filter(username=email).exists():
        raise ValueError("Um usuário com esse e-mail já existe.")

    # Cria o usuário com o e-mail como username
    user = User.objects.create_user(
        username=email,  # Usa o e-mail como username
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name
    )

    return user
