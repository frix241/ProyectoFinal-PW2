from django.db import models
from users.models import User

# Create your models here.

class Restaurant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'tipo': 'restaurante'})
    nombre = models.CharField(max_length=100)
    imagen = models.ImageField(upload_to='restaurantes/', blank=True, null=True)

    def __str__(self):
        return self.nombre
    
class Menu(models.Model):
    restaurante = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    fecha = models.DateField()

    def __str__(self):
        return f"{self.restaurante.nombre} - {self.fecha}"