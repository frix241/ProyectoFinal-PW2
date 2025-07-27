from rest_framework import serializers
from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from .models import User
from restaurants.models import Restaurant

class UserCreateSerializer(BaseUserCreateSerializer):
    nombre_restaurante = serializers.CharField(required=False)
    imagen_restaurante = serializers.ImageField(required=False)

    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ('id', 'username', 'password', 'tipo', 'nombre_restaurante', 'imagen_restaurante')

    def validate(self, attrs):
        # Elimina los campos extra antes de la validación de Djoser
        attrs = attrs.copy()
        attrs.pop('nombre_restaurante', None)
        attrs.pop('imagen_restaurante', None)
        return super().validate(attrs)

    def create(self, validated_data):
        # Recupera los datos originales enviados por el usuario
        nombre_restaurante = self.initial_data.get('nombre_restaurante')
        imagen_restaurante = self.initial_data.get('imagen_restaurante')
        user = super().create(validated_data)
        if user.tipo == 'restaurante':
            Restaurant.objects.create(
                user=user,
                nombre=nombre_restaurante or user.username,
                imagen=imagen_restaurante
            )
        return user