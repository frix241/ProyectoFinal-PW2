from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Restaurant, Menu
from .serializers import RestaurantSerializer, MenuSerializer

class RestaurantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class MenuViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = MenuSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        restaurante_id = self.request.query_params.get('restaurante_id')
        if restaurante_id:
            return Menu.objects.filter(restaurante_id=restaurante_id).order_by('-fecha')
        return Menu.objects.all().order_by('-fecha')
