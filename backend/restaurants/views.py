from rest_framework import viewsets, generics, permissions, filters, status
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from datetime import date 
from .models import Restaurant, Menu, Entrada, Segundo, Pedido
from .serializers import (
    RestaurantListSerializer, MenuCreateSerializer,
    EntradaCreateSerializer, SegundoCreateSerializer,
    MenuReadSerializer, PedidoCreateSerializer, PedidoReadSerializer,
    PedidoEstadoUpdateSerializer, RestaurantUpdateSerializer, RestaurantDetailSerializer,
    PedidoSerializer,
)

# --- ViewSets para CRUD completo ---
class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantListSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre']

class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuCreateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        restaurante = Restaurant.objects.get(user=self.request.user)
        serializer.save(restaurante=restaurante)

class EntradaViewSet(viewsets.ModelViewSet):
    queryset = Entrada.objects.all()  # <-- Agrega esto
    serializer_class = EntradaCreateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        menu_id = self.request.query_params.get('menu_id')
        if menu_id:
            return Entrada.objects.filter(menu_id=menu_id)
        return Entrada.objects.all()

class SegundoViewSet(viewsets.ModelViewSet):
    queryset = Segundo.objects.all()  # <-- Agrega esto
    serializer_class = SegundoCreateSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        menu_id = self.request.query_params.get('menu_id')
        if menu_id:
            return Segundo.objects.filter(menu_id=menu_id)
        return Segundo.objects.all()
    
# --- Vistas personalizadas útiles para tu app ---

class MenusByRestaurantView(generics.ListAPIView):
    serializer_class = MenuReadSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        restaurante_id = self.kwargs['restaurante_id']
        return Menu.objects.filter(restaurante__id=restaurante_id)

class RestaurantByUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, user_id):
        try:
            restaurante = Restaurant.objects.get(user__id=user_id)
            serializer = RestaurantListSerializer(restaurante)
            return Response(serializer.data)
        except Restaurant.DoesNotExist:
            return Response({'detail': 'No existe restaurante para este usuario.'}, status=status.HTTP_404_NOT_FOUND)
        
class MenuHoyByRestaurantView(generics.RetrieveAPIView):
    serializer_class = MenuReadSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        restaurante_id = self.kwargs['restaurante_id']
        hoy = date.today()
        try:
            return Menu.objects.get(restaurante__id=restaurante_id, fecha=hoy)
        except Menu.DoesNotExist:
            # Crear el menú si no existe
            restaurante = Restaurant.objects.get(id=restaurante_id)
            menu = Menu.objects.create(restaurante=restaurante, fecha=hoy)
            return menu

class RestaurantDetailView(generics.RetrieveAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantDetailSerializer

# --- Pedidos ---
class PedidoCreateView(generics.CreateAPIView):
    serializer_class = PedidoCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(cliente=self.request.user)

class PedidosRecibidosView(generics.ListAPIView):
    serializer_class = PedidoReadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Pedido.objects.filter(menu__restaurante__user=self.request.user)

class PedidosPendientesRestauranteView(ListAPIView):
    serializer_class = PedidoReadSerializer
    def get_queryset(self):
        restaurante_id = self.kwargs['restaurante_id']
        return Pedido.objects.filter(menu__restaurante_id=restaurante_id, estado='pendiente')

class PedidoEstadoUpdateView(generics.UpdateAPIView):
    serializer_class = PedidoEstadoUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Pedido.objects.filter(menu__restaurante__user=self.request.user)

class MisPedidosView(generics.ListAPIView):
    serializer_class = PedidoReadSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Pedido.objects.filter(cliente=self.request.user)
    
class PedidoDetailView(RetrieveAPIView):
    queryset = Pedido.objects.all()
    serializer_class = PedidoSerializer

# --- Actualización de perfil restaurante ---
class RestaurantUpdateView(generics.UpdateAPIView):
    serializer_class = RestaurantUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return Restaurant.objects.get(user=self.request.user)

# --- CRUD individual para entradas y segundos (opcional, si quieres rutas separadas) ---
class EntradaRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entrada.objects.all()
    serializer_class = EntradaCreateSerializer

class SegundoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Segundo.objects.all()
    serializer_class = SegundoCreateSerializer