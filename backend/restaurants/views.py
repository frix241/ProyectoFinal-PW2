from rest_framework import generics, permissions, filters
from .models import Menu, Entrada, Segundo, Restaurant
from .serializers import MenuCreateSerializer, EntradaCreateSerializer, SegundoCreateSerializer, MenuReadSerializer, RestaurantListSerializer

class MenuListCreateView(generics.ListCreateAPIView):
    serializer_class = MenuCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo menús del restaurante del usuario autenticado
        return Menu.objects.filter(restaurante__user=self.request.user)

    def perform_create(self, serializer):
        restaurante = Restaurant.objects.get(user=self.request.user)
        serializer.save(restaurante=restaurante)

class EntradaCreateView(generics.CreateAPIView):
    serializer_class = EntradaCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

class SegundoCreateView(generics.CreateAPIView):
    serializer_class = SegundoCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class MenusByRestaurantView(generics.ListAPIView):
    serializer_class = MenuReadSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        restaurante_id = self.kwargs['restaurante_id']
        return Menu.objects.filter(restaurante__id=restaurante_id)
    
class RestaurantListView(generics.ListAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre']