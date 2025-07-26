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
    
class Entrada(models.Model):
    nombre = models.CharField(max_length=100)
    cantidad = models.PositiveIntegerField(default=0)
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    imagen = models.ImageField(upload_to='entradas/', blank=True, null=True)
    menu = models.ForeignKey('Menu', related_name='entradas', on_delete=models.CASCADE, null=True, blank=True)

class Segundo(models.Model):
    nombre = models.CharField(max_length=100)
    cantidad = models.PositiveIntegerField(default=0)
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    imagen = models.ImageField(upload_to='segundos/', blank=True, null=True)
    menu = models.ForeignKey('Menu', related_name='segundos', on_delete=models.CASCADE, null=True, blank=True)


# Modelos para clientes (pedidos)

class Pedido(models.Model):
    cliente = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'tipo': 'cliente'})
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)
    entrada = models.ForeignKey(Entrada, on_delete=models.CASCADE)
    segundo = models.ForeignKey(Segundo, on_delete=models.CASCADE)
    estado = models.CharField(max_length=20, default='pendiente')  # pendiente, entregado, etc.
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pedido de {self.cliente.username} a {self.menu.restaurante.nombre} ({self.fecha})"