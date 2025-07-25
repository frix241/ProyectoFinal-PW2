from rest_framework import serializers
from .models import Restaurant, Menu, Entrada, Segundo, Pedido

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'

class EntradaSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    def get_imagen_url(self, obj):
        if obj.imagen:
            return self.context['request'].build_absolute_uri(obj.imagen.url)
        return None

    class Meta:
        model = Entrada
        fields = '__all__'
        extra_kwargs = {
            'imagen': {'required': False, 'write_only': True}
        }

class SegundoSerializer(serializers.ModelSerializer):
    imagen_url = serializers.SerializerMethodField()

    def get_imagen_url(self, obj):
        if obj.imagen:
            return self.context['request'].build_absolute_uri(obj.imagen.url)
        return None

    class Meta:
        model = Segundo
        fields = '__all__'
        extra_kwargs = {
            'imagen': {'required': False, 'write_only': True}
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
        fields = ['id', 'menu', 'entrada', 'segundo', 'estado']  # Ahora permite actualizar el estado
