from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Menu, Restaurant, Pedido, Entrada, Segundo
from .serializers import (
    MenuCreateSerializer,
    EntradaCreateSerializer,
    SegundoCreateSerializer,
    MenuReadSerializer,
    RestaurantListSerializer,
    PedidoCreateSerializer,
    PedidoReadSerializer,
    PedidoEstadoUpdateSerializer,
    RestaurantUpdateSerializer,
    RestaurantDetailSerializer,
)

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

# Vistas para mostrar los datos de restaurantes por id
class RestaurantByUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, user_id):
        try:
            restaurante = Restaurant.objects.get(user__id=user_id)
            serializer = RestaurantListSerializer(restaurante)
            return Response(serializer.data)
        except Restaurant.DoesNotExist:
            return Response({'detail': 'No existe restaurante para este usuario.'}, status=status.HTTP_404_NOT_FOUND)

# Vistas para pedidos de clientes

class PedidoCreateView(generics.CreateAPIView):
    serializer_class = PedidoCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(cliente=self.request.user)

# Vistas para que restaurantes puedan ver sus pedidos
class PedidosRecibidosView(generics.ListAPIView):
    serializer_class = PedidoReadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo pedidos de menús del restaurante del usuario autenticado
        return Pedido.objects.filter(menu__restaurante__user=self.request.user)
    
class PedidoEstadoUpdateView(generics.UpdateAPIView):
    serializer_class = PedidoEstadoUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo permite actualizar pedidos de menús del restaurante autenticado
        return Pedido.objects.filter(menu__restaurante__user=self.request.user)

class RestaurantUpdateView(generics.UpdateAPIView):
    serializer_class = RestaurantUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Solo el restaurante dueño puede editar su perfil
        return Restaurant.objects.get(user=self.request.user)

# Vistas para pedidos de clientes
class MisPedidosView(generics.ListAPIView):
    serializer_class = PedidoReadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Solo pedidos realizados por el usuario autenticado (cliente)
        return Pedido.objects.filter(cliente=self.request.user)
# Vistas para editar segundo y entrada
class EntradaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entrada.objects.all()
    serializer_class = EntradaCreateSerializer

class SegundoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Segundo.objects.all()
    serializer_class = SegundoCreateSerializer

# Vistas para mostrar los datos de restaurantes por id
class RestaurantDetailView(generics.RetrieveAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantDetailSerializer