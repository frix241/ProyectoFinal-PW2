from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RestaurantViewSet, MenuViewSet, PedidoViewSet,
    EntradaViewSet, SegundoViewSet  # <-- añade esto
)

router = DefaultRouter()
router.register(r'restaurantes', RestaurantViewSet)
router.register(r'menus', MenuViewSet)
router.register(r'pedidos', PedidoViewSet, basename='pedido')
router.register(r'entradas', EntradaViewSet)
router.register(r'segundos', SegundoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
