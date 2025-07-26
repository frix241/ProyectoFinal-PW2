from django.urls import path
from .views import (
    RestaurantListView,
    MenuListCreateView,
    EntradaCreateView,
    SegundoCreateView,
    MenusByRestaurantView,
    PedidoCreateView,
    PedidosRecibidosView,
    PedidoEstadoUpdateView,
    RestaurantUpdateView,
    MisPedidosView,
)

urlpatterns = [
    path('restaurantes/', RestaurantListView.as_view(), name='restaurant-list'),
    path('menus/', MenuListCreateView.as_view(), name='menu-list-create'),
    path('entradas/', EntradaCreateView.as_view(), name='entrada-create'),
    path('segundos/', SegundoCreateView.as_view(), name='segundo-create'),
    path('restaurante/<int:restaurante_id>/menus/', MenusByRestaurantView.as_view(), name='menus-by-restaurant'),
    path('pedidos/', PedidoCreateView.as_view(), name='pedido-create'),
    path('pedidos-recibidos/', PedidosRecibidosView.as_view(), name='pedidos-recibidos'),
    path('pedidos/<int:pk>/estado/', PedidoEstadoUpdateView.as_view(), name='pedido-estado-update'),
    path('mi-restaurante/editar/', RestaurantUpdateView.as_view(), name='restaurant-update'),
    path('mis-pedidos/', MisPedidosView.as_view(), name='mis-pedidos'),
]