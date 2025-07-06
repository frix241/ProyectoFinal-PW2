from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticatedOrReadOnly 
from .models import Restaurant, Menu, Pedido, Entrada, Segundo
from .serializers import RestaurantSerializer, MenuSerializer, PedidoSerializer, EntradaSerializer, SegundoSerializer

class RestaurantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MenuViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Menu.objects.all().order_by('-fecha')
    serializer_class = MenuSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        restaurante_id = self.request.query_params.get('restaurante_id')
        if restaurante_id:
            return Menu.objects.filter(restaurante_id=restaurante_id).order_by('-fecha')
        return Menu.objects.all().order_by('-fecha')
class PedidoViewSet(viewsets.ModelViewSet):
    queryset = Pedido.objects.all().order_by('-fecha')
    serializer_class = PedidoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        entrada = serializer.validated_data['entrada']
        segundo = serializer.validated_data['segundo']
        total = entrada.precio + segundo.precio

        serializer.save(cliente=self.request.user, estado='pendiente', total=total)

class EntradaViewSet(viewsets.ModelViewSet):
    queryset = Entrada.objects.all()
    serializer_class = EntradaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class SegundoViewSet(viewsets.ModelViewSet):
    queryset = Segundo.objects.all()
    serializer_class = SegundoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
