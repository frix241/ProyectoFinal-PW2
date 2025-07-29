from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    TIPO_USUARIO = (
        ('cliente', 'Cliente'),
        ('restaurante', 'Restaurante'),
    )
    tipo = models.CharField(max_length=15, choices=TIPO_USUARIO, default='cliente')

    def __str__(self):
        return f"{self.username} ({self.tipo})"