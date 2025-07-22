from rest_framework import serializers
from .models import Restaurant, Menu, Entrada, Segundo, Pedido

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'

class EntradaSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()  # Cambia el nombre a imagen_url para coincidir con tu frontend

    def get_imagen_url(self, obj):
        if obj.imagen:
            return self.context['request'].build_absolute_uri(obj.imagen.url)  # URL completa
        return None

    class Meta:
        model = Entrada
        fields = '__all__'
        extra_kwargs = {
            'imagen': {'required': False, 'write_only': True}  # imagen es solo para escritura
        }

class SegundoSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()  # Cambia el nombre a imagen_url para coincidir con tu frontend

    def get_imagen_url(self, obj):
        if obj.imagen:
            return self.context['request'].build_absolute_uri(obj.imagen.url)  # URL completa
        return None

    class Meta:
        model = Segundo
        fields = '__all__'
        extra_kwargs = {
            'imagen': {'required': False, 'write_only': True}  # imagen es solo para escritura
        }


class MenuSerializer(serializers.ModelSerializer):
    entradas = EntradaSerializer(many=True, read_only=True)
    segundos = SegundoSerializer(many=True, read_only=True)

    class Meta:
        model = Menu
        fields = ['id', 'restaurante', 'fecha', 'entradas', 'segundos']


class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = "__all__"
        depth = 2


class PedidoWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ['id', 'menu', 'entrada', 'segundo']
