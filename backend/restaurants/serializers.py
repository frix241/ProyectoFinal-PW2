from rest_framework import serializers
from .models import Restaurant, Menu, Entrada, Segundo, Pedido

# Crear serializers para Menu, Entrada y Segundo
class MenuCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id', 'fecha']
    
class EntradaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrada
        fields = ['id', 'nombre', 'cantidad', 'precio', 'imagen', 'menu']

class SegundoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Segundo
        fields = ['id', 'nombre', 'cantidad', 'precio', 'imagen', 'menu']

# listar los menús con entradas y segundos
class MenuReadSerializer(serializers.ModelSerializer):
    entradas = EntradaCreateSerializer(many=True, read_only=True)
    segundos = SegundoCreateSerializer(many=True, read_only=True)

    class Meta:
        model = Menu
        fields = ['id', 'restaurante', 'fecha', 'entradas', 'segundos']

class RestaurantListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'nombre', 'imagen']


# Serializer para pedidos de clientes

class PedidoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ['id', 'menu', 'entrada', 'segundo']