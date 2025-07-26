from rest_framework import generics, permissions
from .models import Menu, Restaurant
from .serializers import MenuCreateSerializer

class MenuListCreateView(generics.ListCreateAPIView):
    serializer_class = MenuCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo menús del restaurante del usuario autenticado
        return Menu.objects.filter(restaurante__user=self.request.user)

    def perform_create(self, serializer):
        restaurante = Restaurant.objects.get(user=self.request.user)
        serializer.save(restaurante=restaurante)