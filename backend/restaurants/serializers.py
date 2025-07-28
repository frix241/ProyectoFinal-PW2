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
# Serializador para listar los restaurantes
class RestaurantListSerializer(serializers.ModelSerializer):
    imagen = serializers.ImageField(use_url=True)
    class Meta:
        model = Restaurant
        fields = ['id', 'nombre', 'imagen']


# Serializador para mostrar los datos de restaurantes por id
class RestaurantDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['id', 'nombre', 'imagen']

# listar los menús con entradas y segundos
class MenuReadSerializer(serializers.ModelSerializer):
    entradas = EntradaCreateSerializer(many=True, read_only=True)
    segundos = SegundoCreateSerializer(many=True, read_only=True)

    class Meta:
        model = Menu
        fields = ['id', 'restaurante', 'fecha', 'entradas', 'segundos']


# Serializer para pedidos de clientes

class PedidoCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ['id', 'menu', 'entrada', 'segundo']

    def validate(self, data):
        menu = data['menu']
        entrada = data['entrada']
        segundo = data['segundo']

        # Verifica que la entrada pertenezca al menú
        if entrada.menu != menu:
            raise serializers.ValidationError("La entrada seleccionada no pertenece al menú elegido.")

        # Verifica que el segundo pertenezca al menú
        if segundo.menu != menu:
            raise serializers.ValidationError("El segundo seleccionado no pertenece al menú elegido.")

        return data
    
# Serializer para que restaurantes puedan ver sus pedidos
class PedidoReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'menu', 'entrada', 'segundo', 'estado', 'fecha']
        depth = 2

# Actualizar el estado del pedido
class PedidoEstadoUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = ['estado']

# Editar el restaurante
class RestaurantUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['nombre', 'imagen']

# Serializer para detalles de pedidos
class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'