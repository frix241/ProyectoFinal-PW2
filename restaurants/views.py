
from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Restaurant, Menu, Pedido, Entrada, Segundo
from .serializers import (
    RestaurantSerializer,
    MenuSerializer,
    PedidoSerializer,
    PedidoWriteSerializer,
    EntradaSerializer,
    SegundoSerializer
)

class RestaurantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MenuViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        restaurante_id = self.request.query_params.get('restaurante_id')
        if restaurante_id:
           return Menu.objects.filter(restaurante_id=restaurante_id).order_by('-fecha')
        return Menu.objects.all().order_by('-fecha')

    def get_queryset(self):
        restaurante_id = self.request.query_params.get('restaurante_id')
        if restaurante_id:
            return Menu.objects.filter(restaurante_id=restaurante_id).order_by('-fecha')
        return Menu.objects.all().order_by('-fecha')



class PedidoViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'restaurant'):
            return Pedido.objects.filter(menu__restaurante=user.restaurant).order_by('-fecha')
        return Pedido.objects.filter(cliente=user).order_by('-fecha')

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return PedidoWriteSerializer  # Solo IDs
        return PedidoSerializer  # Con menu_detalle, entrada_detalle, etc.

    def perform_create(self, serializer):
        entrada = serializer.validated_data['entrada']
        segundo = serializer.validated_data['segundo']
        total = entrada.precio + segundo.precio
        serializer.save(cliente=self.request.user, estado='pendiente', total=total)

class EntradaViewSet(viewsets.ModelViewSet):
    queryset = Entrada.objects.all()
    serializer_class = EntradaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class SegundoViewSet(viewsets.ModelViewSet):
    queryset = Segundo.objects.all()
    serializer_class = SegundoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
