from django.urls import path
from .views import RestaurantListView, MenuListCreateView, EntradaCreateView, SegundoCreateView, MenusByRestaurantView

urlpatterns = [
    path('restaurantes/', RestaurantListView.as_view(), name='restaurant-list'),
    path('menus/', MenuListCreateView.as_view(), name='menu-list-create'),
    path('entradas/', EntradaCreateView.as_view(), name='entrada-create'),
    path('segundos/', SegundoCreateView.as_view(), name='segundo-create'),
    path('restaurante/<int:restaurante_id>/menus/', MenusByRestaurantView.as_view(), name='menus-by-restaurant'),
]