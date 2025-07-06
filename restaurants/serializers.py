from rest_framework import serializers
from .models import Restaurant, Menu, Entrada, Segundo

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'

class EntradaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrada
        fields = '__all__'

class SegundoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Segundo
        fields = '__all__'

class MenuSerializer(serializers.ModelSerializer):
    entradas = EntradaSerializer(many=True, read_only=True)
    segundos = SegundoSerializer(many=True, read_only=True)

    class Meta:
        model = Menu
        fields = ['id', 'restaurante', 'fecha', 'entradas', 'segundos']


from .models import Pedido

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'
        read_only_fields = ['cliente', 'fecha', 'total']