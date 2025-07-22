from django.db import models
from users.models import User

class Restaurant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200)

    def __str__(self):
        return self.nombre

class Entrada(models.Model):
    #menu = models.ForeignKey('Menu', related_name='entradas', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    cantidad = models.PositiveIntegerField(default=0)
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    imagen = models.ImageField(upload_to='entradas/', blank=True, null=True)
    @property
    def disponible(self):
        return self.cantidad > 0

    def __str__(self):
        return f"{self.nombre} ({self.menu.fecha})"

class Segundo(models.Model):
    #menu = models.ForeignKey('Menu', related_name='segundos', on_delete=models.CASCADE)
    nombre = models.CharField(max_length=100)
    cantidad = models.PositiveIntegerField(default=0)
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    imagen = models.ImageField(upload_to='segundos/', blank=True, null=True)

    @property
    def disponible(self):
        return self.cantidad > 0

    def __str__(self):
        return f"{self.nombre} ({self.menu.fecha})"

class Menu(models.Model):
    restaurante = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    fecha = models.DateField()

    def __str__(self):
        return f"{self.restaurante.nombre} - {self.fecha}"


class Pedido(models.Model):
    cliente = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pedidos')
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)
    entrada = models.ForeignKey(Entrada, on_delete=models.CASCADE)
    segundo = models.ForeignKey(Segundo, on_delete=models.CASCADE)
    total = models.DecimalField(max_digits=6, decimal_places=2)
    estado = models.CharField(
        max_length=10,
        choices=[('pendiente', 'Pendiente'), ('aceptado', 'Aceptado'), ('rechazado', 'Rechazado')],
        default='pendiente'
    )
    fecha = models.DateTimeField(auto_now_add=True)
