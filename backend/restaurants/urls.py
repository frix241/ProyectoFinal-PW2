from django.urls import path
from .views import MenuListCreateView

urlpatterns = [
    path('menus/', MenuListCreateView.as_view(), name='menu-list-create'),
]