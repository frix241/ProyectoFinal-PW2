from rest_framework import serializers
from .models import Menu

class MenuCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ['id', 'fecha']