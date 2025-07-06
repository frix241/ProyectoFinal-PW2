from django.db import models
from users.models import User

class Restaurant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)

    def __str__(self):
        return self.nombre

class Menu(models.Model):
    restaurante = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    fecha = models.DateField()
    entrada = models.CharField(max_length=100)
    entrada_disponible = models.BooleanField(default=True)
    entrada_precio = models.DecimalField(max_digits=6, decimal_places=2)
    segundo = models.CharField(max_length=100)
    segundo_disponible = models.BooleanField(default=True)
    segundo_precio = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return f"{self.restaurante.nombre} - {self.fecha}"

class Pedido(models.Model):
    ESTADOS = (
        ('pendiente', 'Pendiente'),
        ('aceptado', 'Aceptado'),
        ('rechazado', 'Rechazado'),
    )

    cliente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pedidos')
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)
    entrada = models.CharField(max_length=100)
    segundo = models.CharField(max_length=100)
    total = models.DecimalField(max_digits=6, decimal_places=2)
    estado = models.CharField(max_length=10, choices=ESTADOS, default='pendiente')
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Pedido #{self.id} - {self.cliente.username}"
