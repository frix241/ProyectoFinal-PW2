from djoser.serializers import UserSerializer as BaseUserSerializer, UserCreateSerializer as BaseUserCreateSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(BaseUserSerializer):
    class Meta(BaseUserSerializer.Meta):
        model = User
        fields = ['id', 'username', 'email', 'tipo']  # 👈 importante

class UserCreateSerializer(BaseUserCreateSerializer):
    tipo = serializers.ChoiceField(choices=User.TIPO_USUARIO, default='cliente')
    nombreRestaurante = serializers.CharField(max_length=100, required=False, allow_blank=True)
    
    class Meta(BaseUserCreateSerializer.Meta):
        model = User
        fields = ['id', 'username', 'password', 'email', 'tipo', 'nombreRestaurante']
    
    def validate(self, attrs):
        # Quitar nombreRestaurante de los atributos antes de validar User
        nombre_restaurante = attrs.pop('nombreRestaurante', None)
        
        # Validar con los atributos que el modelo User acepta
        validated_attrs = super().validate(attrs)
        
        # Volver a agregar nombreRestaurante para usarlo en create()
        if nombre_restaurante:
            validated_attrs['nombreRestaurante'] = nombre_restaurante
            
        return validated_attrs
    
    def create(self, validated_data):
        nombre_restaurante = validated_data.pop('nombreRestaurante', None)
        user = super().create(validated_data)
        
        # Si es restaurante, crear el objeto Restaurant
        if user.tipo == 'restaurante' and nombre_restaurante:
            from restaurants.models import Restaurant
            Restaurant.objects.create(
                user=user,
                nombre=nombre_restaurante,
                direccion=""  # Se puede completar después
            )
        
        return user
