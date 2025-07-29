from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RestaurantViewSet, MenuViewSet, EntradaViewSet, SegundoViewSet,
    MenusByRestaurantView, PedidoCreateView, PedidosRecibidosView,
    PedidoEstadoUpdateView, RestaurantUpdateView, MisPedidosView,
    RestaurantDetailView, RestaurantByUserView, MenuHoyByRestaurantView,
    PedidoDetailView, PedidosPendientesRestauranteView, PedidosHistorialRestauranteView
)

# --- Routers para CRUD automático ---
router = DefaultRouter()
router.register(r'restaurantes', RestaurantViewSet)
router.register(r'menus', MenuViewSet)
router.register(r'entradas', EntradaViewSet)
router.register(r'segundos', SegundoViewSet)

urlpatterns = [
    # --- CRUD básico (ViewSets) ---
    path('', include(router.urls)),

    # --- Vistas personalizadas y detalles ---
    path('restaurantes/id/<int:user_id>/', RestaurantByUserView.as_view(), name='restaurant-by-user'),
    path('restaurantes/<int:pk>/', RestaurantDetailView.as_view(), name='restaurant-detail'),
    path('restaurante/<int:restaurante_id>/menus/', MenusByRestaurantView.as_view(), name='menus-by-restaurant'),
    path('restaurante/<int:restaurante_id>/menu-hoy/', MenuHoyByRestaurantView.as_view(), name='menu-hoy-by-restaurant'),

    # --- Pedidos ---
    path('pedidos/', PedidoCreateView.as_view(), name='pedido-create'),
    path('pedidos-recibidos/', PedidosRecibidosView.as_view(), name='pedidos-recibidos'),
    path('pedidos/<int:pk>/estado/', PedidoEstadoUpdateView.as_view(), name='pedido-estado-update'),
    path('mi-restaurante/editar/', RestaurantUpdateView.as_view(), name='restaurant-update'),
    path('mis-pedidos/', MisPedidosView.as_view(), name='mis-pedidos'),
    path('pedidos/<int:pk>/', PedidoDetailView.as_view(), name='pedido-detail'),
    path('restaurante/<int:restaurante_id>/pedidos-pendientes/', PedidosPendientesRestauranteView.as_view(), name='pedidos-pendientes-restaurante'),
    path('restaurante/<int:restaurante_id>/historial-pedidos/', PedidosHistorialRestauranteView.as_view(), name='historial-pedidos-restaurante'),
]