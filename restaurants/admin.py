from django.contrib import admin
from .models import Restaurant, Menu, Entrada, Segundo, Pedido

admin.site.register(Restaurant)
admin.site.register(Menu)
admin.site.register(Entrada)
admin.site.register(Segundo)
admin.site.register(Pedido)
