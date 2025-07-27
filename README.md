# ProyectoFinal-PW2
## manejo de imagenes
pip install Pillow 
pip install django-cors-headers
pip install djangorestframework-simplejwt
pip install djoser
pip install django-cors-headers
## EStructura angular
src/
  app/
    auth/                        # Login, registro, logout
    restaurants/                 # Listado de restaurantes, detalles, menú del día
      menu-dia/                  # Crear/editar menú del día (solo restaurante)
      pedidos-dia/               # Ver pedidos del día (solo restaurante)
      historial/                 # Historial de pedidos (solo restaurante)
    clientes/                    # Vistas específicas para clientes
      explorador-restaurantes/   # Panel principal: seleccionar y filtrar restaurantes, botón a "mis pedidos"
      menu-restaurante/          # Menú del restaurante seleccionado: muestra menú y permite seleccionar platos
      confirmacion-pedido/       # Confirmación de pedido: muestra estado tras seleccionar y confirmar platos
      mis-pedidos/               # Ver los pedidos realizados por el usuario
    services/                    # Servicios generales (auth, guards, interceptors)