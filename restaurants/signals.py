from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Restaurant, Menu
from datetime import date

@receiver(post_save, sender=Restaurant)
def crear_menu_automatico(sender, instance, created, **kwargs):
    if created:
        Menu.objects.create(
            restaurante=instance,
            fecha=date.today()
        )
