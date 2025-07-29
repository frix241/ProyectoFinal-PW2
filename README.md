# ProyectoFinal-PW2

## Introducción

Este informe documenta el desarrollo y la estructura del proyecto **ProyectoFinal-PW2**, una plataforma web para la gestión de restaurantes y pedidos en línea. El sistema está construido utilizando Django para el backend y Angular para el frontend, permitiendo la interacción entre clientes y restaurantes de manera eficiente y segura.  
A lo largo del informe se detallan las configuraciones principales, los modelos de datos, los serializers, las vistas, las rutas y la administración del backend, así como la organización y funcionamiento de los principales componentes del frontend.  
El objetivo es mostrar cómo se integran las diferentes tecnologías y módulos para ofrecer una solución completa de registro, autenticación, gestión de menús, pedidos y seguimiento tanto para usuarios clientes como para restaurantes.

## Estructura Django

backend/  
 settings.py  
 urls.py  

users/  
 models.py  
 serializers.py  
 admin.py  

restaurants/  
 models.py  
 serializers.py  

## Estructura Angular

src/  
 app/  
  auth/  
  restaurants/  
   menu-dia/  
   pedidos-dia/  
   historial/  
  clientes/  
   explorador-restaurantes/  
   menu-restaurante/  
   confirmacion-pedido/  
   mis-pedidos/  
  services/

# Django

Aquí tienes un **informe explicativo** sobre las configuraciones y librerías usadas en tu archivo settings.py de Django, guiado por el propio archivo y explicando cada parte relevante del código:


## Dependencias
pip install Pillow  
pip install django-cors-headers  
pip install djangorestframework-simplejwt  
pip install djoser  
pip install django-cors-headers  

## Configuraciones

### Importaciones y rutas
```python
from datetime import timedelta
from pathlib import Path
import os
```
- Se importan módulos para manejar rutas de archivos y definir tiempos de expiración (por ejemplo, para JWT).


### Rutas de archivos estáticos y media
```python
BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
STATIC_URL = 'static/'
```
- BASE_DIR define la ruta base del proyecto.
- MEDIA_URL y MEDIA_ROOT configuran dónde se almacenan y cómo se acceden los archivos subidos por los usuarios.
- STATIC_URL define la ruta para los archivos estáticos (CSS, JS, imágenes).


### Seguridad
```python
SECRET_KEY = '...'
DEBUG = True
ALLOWED_HOSTS = []
```
- SECRET_KEY es la clave secreta de Django, usada para seguridad interna.
- DEBUG activa el modo de desarrollo (debe ser False en producción).
- ALLOWED_HOSTS define los dominios permitidos para acceder a la app.


### Configuración de JWT (JSON Web Token)
```python
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),  
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}
```
- Se usa la librería Simple JWT para autenticación basada en tokens.
- Define que el token de acceso dura 1 hora y el de refresco 1 día.


### Aplicaciones instaladas
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    ...
    'rest_framework',
    'rest_framework.authtoken',
    'djoser',
    'corsheaders',
    'users',
    'restaurants',
]
```
- Incluye apps de Django (admin, auth, etc.).
- rest_framework: Framework para crear APIs REST.
- rest_framework.authtoken: Autenticación por token.
- djoser: Endpoints listos para autenticación y gestión de usuarios.
- corsheaders: Permite peticiones desde otros dominios (CORS).
- users y restaurants: Apps propias del proyecto.


### Modelo de usuario personalizado
```python
AUTH_USER_MODEL = 'users.User'
```
- Se usa un modelo de usuario propio (User en la app users) para poder agregar campos personalizados (como tipo de usuario).


### Middleware
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]
```
- Lista de middlewares que procesan cada petición/respuesta.
- CorsMiddleware permite el uso de CORS para el frontend Angular.


## 8. CORS
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
]
```
- Permite que el frontend Angular (en el puerto 4200) haga peticiones a la API Django.


## 9. Base de datos
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```
- Usa SQLite como base de datos por defecto (ideal para desarrollo).


## 10. Internacionalización
```python
LANGUAGE_CODE = 'es-pe'
TIME_ZONE = 'America/Lima'
USE_I18N = True
USE_TZ = True
```
- Configura el idioma y la zona horaria para Perú.


## 11. Configuración de DRF y Djoser
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}
DJOSER = {
    'SERIALIZERS': {
        'user_create': 'users.serializers.UserCreateSerializer',
        'user': 'users.serializers.UserSerializer',
        'current_user': 'users.serializers.UserSerializer',
    }
}
```
- REST_FRAMEWORK: Usa JWT como método de autenticación por defecto.
- DJOSER: Define los serializadores personalizados para la gestión de usuarios.


## 12. Otros
```python
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
```
- Define el tipo de campo auto-incremental por defecto para los modelos.


# modelos y apps
Aquí tienes un **informe corto y claro** sobre los modelos y las apps creadas en tu proyecto Django:


## 1. **Apps creadas**

- **users:**  
  Gestiona los usuarios del sistema, permitiendo distinguir entre clientes y restaurantes mediante un campo personalizado.
- **restaurants:**  
  Gestiona toda la lógica relacionada a restaurantes, menús, platos y pedidos.


## 2. **Modelo de Usuario Personalizado (models.py)**

```python
class User(AbstractUser):
    TIPO_USUARIO = (
        ('cliente', 'Cliente'),
        ('restaurante', 'Restaurante'),
    )
    tipo = models.CharField(max_length=15, choices=TIPO_USUARIO, default='cliente')
```
- Hereda de `AbstractUser` para aprovechar la autenticación de Django.
- Agrega el campo `tipo` para diferenciar entre usuarios cliente y restaurante.
- Permite extender fácilmente la lógica de autenticación y permisos.


## 3. **Modelos de la app `restaurants` (models.py)**

### a) **Restaurant**
```python
class Restaurant(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, limit_choices_to={'tipo': 'restaurante'})
    nombre = models.CharField(max_length=100)
    imagen = models.ImageField(upload_to='restaurantes/', blank=True, null=True)
```
- Relaciona un usuario tipo restaurante con su información específica (nombre, imagen).

### b) **Menu**
```python
class Menu(models.Model):
    restaurante = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    fecha = models.DateField()
```
- Representa el menú del día de un restaurante.

### c) **Entrada y Segundo**
```python
class Entrada(models.Model):
    nombre = models.CharField(max_length=100)
    cantidad = models.PositiveIntegerField(default=0)
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    imagen = models.ImageField(upload_to='entradas/', blank=True, null=True)
    menu = models.ForeignKey('Menu', related_name='entradas', on_delete=models.CASCADE)
```
- **Entrada** y **Segundo** representan los platos disponibles en el menú del día, cada uno con nombre, cantidad, precio, imagen y relación al menú.

### d) **Pedido**
```python
class Pedido(models.Model):
    cliente = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'tipo': 'cliente'})
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)
    entrada = models.ForeignKey(Entrada, on_delete=models.CASCADE)
    segundo = models.ForeignKey(Segundo, on_delete=models.CASCADE)
    estado = models.CharField(max_length=20, choices=ESTADOS, default='pendiente')
    fecha = models.DateTimeField(auto_now_add=True)
```
- Representa un pedido realizado por un cliente, con referencias al menú, entrada y segundo elegidos, estado del pedido y fecha.


**Resumen:**  
Se crearon dos apps principales:  
- `users` para la gestión de usuarios personalizados (clientes y restaurantes).
- `restaurants` para la gestión de restaurantes, menús, platos y pedidos, modelando toda la lógica del negocio del sistema.  
Cada modelo está relacionado para reflejar las operaciones reales de un sistema de pedidos de comida.


# serealizer

Aquí tienes un **informe corto y claro** sobre los serializers usados en tu proyecto Django:


## ¿Qué son los serializers?
Los **serializers** en Django REST Framework permiten convertir los modelos de la base de datos a formatos como JSON para enviar datos al frontend, y también validar y transformar datos recibidos desde el frontend antes de guardarlos en la base de datos.


## 1. **Serializers de usuarios (serializers.py)**

- **UserCreateSerializer**  
  Extiende el serializer de Djoser para permitir el registro de usuarios tipo restaurante con campos extra (`nombre_restaurante`, `imagen_restaurante`).  
  Si el usuario es restaurante, crea automáticamente un objeto `Restaurant` relacionado.

- **UserSerializer**  
  Serializa los datos básicos del usuario (`id`, `username`, `tipo`).


## 2. **Serializers de restaurantes y pedidos (serializers.py)**

- **RestaurantListSerializer / RestaurantDetailSerializer**  
  Permiten listar y mostrar detalles de restaurantes, incluyendo la imagen.

- **MenuCreateSerializer, EntradaCreateSerializer, SegundoCreateSerializer**  
  Permiten crear menús, entradas y segundos (platos) con sus campos principales.

- **MenuReadSerializer**  
  Permite mostrar un menú junto con sus entradas y segundos relacionados.

- **PedidoCreateSerializer**  
  Permite crear pedidos, validando que los platos seleccionados pertenezcan al menú elegido.

- **PedidoReadSerializer**  
  Permite mostrar los pedidos con detalles de los platos (entrada y segundo).

- **PedidoEstadoUpdateSerializer**  
  Permite actualizar solo el estado de un pedido (aceptado, rechazado, etc.).

- **RestaurantUpdateSerializer**  
  Permite editar los datos de un restaurante.

- **PedidoSerializer**  
  Serializador general para mostrar todos los campos de un pedido.


**Resumen:**  
Los serializers permiten controlar cómo se envían y reciben los datos entre el frontend y el backend, asegurando que la información sea válida y esté bien estructurada para cada operación del sistema (registro, menús, pedidos, etc.).





# Views

### Informe: Vistas (views.py) en el proyecto Django


#### 1. **¿Por qué no hay views en la app `users`?**

No es necesario crear vistas personalizadas en la app `users` porque la autenticación y gestión de usuarios se maneja con **Djoser** y **Django REST Framework**.  
Estas librerías ya proveen endpoints listos para:
- Registro de usuarios
- Login/logout
- Recuperación de contraseña
- Obtener y actualizar el usuario actual

Además, los serializers personalizados permiten adaptar el registro para usuarios tipo restaurante sin necesidad de crear views propias.


#### 2. **Vistas en la app `restaurants`**

Aquí sí se crean vistas porque la lógica de negocio es más específica y no la cubren librerías externas.  
Se usan principalmente **ViewSets** y **Generic Views** para:

- CRUD de restaurantes, menús, entradas y segundos (platos)
- Obtener menús por restaurante y por fecha
- Crear y listar pedidos, actualizar su estado
- Listar historial de pedidos y pedidos pendientes
- Actualizar perfil de restaurante

Ejemplo de un ViewSet para restaurantes:
```python
class RestaurantViewSet(viewsets.ModelViewSet):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantListSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre']
```

Ejemplo de vista personalizada para obtener el menú del día:
```python
class MenuHoyByRestaurantView(generics.RetrieveAPIView):
    serializer_class = MenuReadSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        restaurante_id = self.kwargs['restaurante_id']
        hoy = date.today()
        try:
            return Menu.objects.get(restaurante__id=restaurante_id, fecha=hoy)
        except Menu.DoesNotExist:
            restaurante = Restaurant.objects.get(id=restaurante_id)
            menu = Menu.objects.create(restaurante=restaurante, fecha=hoy)
            return menu
```


#### **Resumen**
- **users:** No tiene views propias porque Djoser y DRF ya proveen todos los endpoints necesarios para usuarios.
- **restaurants:** Tiene views personalizadas para toda la lógica de restaurantes, menús, platos y pedidos, usando ViewSets y Generic Views para facilitar el desarrollo y mantener el código organizado.


Aquí tienes un **informe claro y completo** sobre la configuración de **urls** y **admin** en tu proyecto Django:


## 1. **Configuración de URLs**

### a) **Archivo principal de URLs (urls.py)**

```python
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/restaurants/', include('restaurants.urls')),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

**Explicación:**
- `admin/`: Acceso al panel de administración de Django.
- `api/restaurants/`: Todas las rutas de la app `restaurants` (menús, platos, pedidos, etc.).
- `auth/`: Endpoints de autenticación y gestión de usuarios proporcionados por Djoser (registro, login, logout, etc.).
- Se sirve la media (imágenes) en modo desarrollo.


### b) **URLs de la app `restaurants` (urls.py)**

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RestaurantViewSet, MenuViewSet, EntradaViewSet, SegundoViewSet,
    MenusByRestaurantView, PedidoCreateView, PedidosRecibidosView,
    PedidoEstadoUpdateView, RestaurantUpdateView, MisPedidosView,
    RestaurantDetailView, RestaurantByUserView, MenuHoyByRestaurantView,
    PedidoDetailView, PedidosPendientesRestauranteView, PedidosHistorialRestauranteView
)

router = DefaultRouter()
router.register(r'restaurantes', RestaurantViewSet)
router.register(r'menus', MenuViewSet)
router.register(r'entradas', EntradaViewSet)
router.register(r'segundos', SegundoViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('restaurantes/id/<int:user_id>/', RestaurantByUserView.as_view(), name='restaurant-by-user'),
    path('restaurantes/<int:pk>/', RestaurantDetailView.as_view(), name='restaurant-detail'),
    path('restaurante/<int:restaurante_id>/menus/', MenusByRestaurantView.as_view(), name='menus-by-restaurant'),
    path('restaurante/<int:restaurante_id>/menu-hoy/', MenuHoyByRestaurantView.as_view(), name='menu-hoy-by-restaurant'),
    path('pedidos/', PedidoCreateView.as_view(), name='pedido-create'),
    path('pedidos-recibidos/', PedidosRecibidosView.as_view(), name='pedidos-recibidos'),
    path('pedidos/<int:pk>/estado/', PedidoEstadoUpdateView.as_view(), name='pedido-estado-update'),
    path('mi-restaurante/editar/', RestaurantUpdateView.as_view(), name='restaurant-update'),
    path('mis-pedidos/', MisPedidosView.as_view(), name='mis-pedidos'),
    path('pedidos/<int:pk>/', PedidoDetailView.as_view(), name='pedido-detail'),
    path('restaurante/<int:restaurante_id>/pedidos-pendientes/', PedidosPendientesRestauranteView.as_view(), name='pedidos-pendientes-restaurante'),
    path('restaurante/<int:restaurante_id>/historial-pedidos/', PedidosHistorialRestauranteView.as_view(), name='historial-pedidos-restaurante'),
]
```

**Explicación:**
- Usa un router para CRUD automático de restaurantes, menús, entradas y segundos.
- Define rutas personalizadas para obtener menús por restaurante, menú del día, crear y listar pedidos, actualizar estado, historial, etc.


## 2. **Configuración del Admin**

### a) **Admin de la app `restaurants` (admin.py)**

```python
from django.contrib import admin
from .models import Restaurant, Menu, Entrada, Segundo, Pedido

admin.site.register(Restaurant)
admin.site.register(Menu)
admin.site.register(Entrada)
admin.site.register(Segundo)
admin.site.register(Pedido)
```
**Explicación:**  
Permite administrar desde el panel de Django todos los modelos relacionados a restaurantes, menús, platos y pedidos.


### b) **Admin de la app `users` (admin.py)**

```python
from django.contrib import admin
from .models import User

admin.site.register(User)
```
**Explicación:**  
Permite administrar los usuarios personalizados desde el panel de Django.


**Resumen:**  
- Las URLs principales conectan el admin, la API de restaurantes y la autenticación de usuarios.
- Las URLs de la app `restaurants` organizan todos los endpoints de negocio.
- El admin de Django permite gestionar todos los modelos del sistema de forma visual y sencilla.

Similar code found with 1 license type





# Angular


## dependencias
  npm install jspdf jspdf-invoice-template

# register
  ¡Perfecto! Aquí tienes una **estructura clara para tu diapositiva sobre el registro de usuario** en tu frontend Angular, explicando cada parte del flujo:


## 1. **Formulario HTML (register.html)**
- El usuario llena los campos: usuario, contraseña, tipo (cliente/restaurante), y datos extra si es restaurante.
- El formulario está enlazado a variables del componente (`username`, `password`, `tipo`, etc.) y al método `onSubmit()`.

## 2. **Componente Angular (register.ts)**
- Recibe los datos del formulario.
- Si el tipo es restaurante, agrega los campos extra al `FormData`.
- Llama al método `register()` del servicio `Auth` para enviar los datos al backend.
- Maneja la respuesta mostrando mensajes de éxito o error.

```typescript
// ...en el componente...
onSubmit() {
  const formData = new FormData();
  formData.append('username', this.username);
  formData.append('password', this.password);
  formData.append('tipo', this.tipo);
  // Si es restaurante, agrega más datos
  if (this.tipo === 'restaurante') {
    formData.append('nombre_restaurante', this.nombreRestaurante);
    if (this.imagenRestaurante) {
      formData.append('imagen_restaurante', this.imagenRestaurante);
    }
  }
  this.auth.register(formData).subscribe({
    next: () => { this.success = 'Registro exitoso.'; },
    error: () => { this.error = 'Error en el registro.'; }
  });
}
```

## 3. **Servicio Auth (auth.ts)**
- El método `register()` hace una petición HTTP POST a la URL `/auth/users/` del backend Django.
- El servicio se encarga de la comunicación con la API.

```typescript
register(data: any): Observable<any> {
  return this.http.post(`${this.apiUrl}users/`, data);
}
```

## 4. **Conexión con el backend Django**
- El endpoint `/auth/users/` es gestionado por Django (Djoser).
- Django recibe los datos, crea el usuario y responde al frontend.

## 5. **Resumen visual del flujo**
```
Usuario (HTML) → RegisterComponent (onSubmit) → AuthService (register) → Django API (/auth/users/)
```


¿Quieres que te ayude a armar la diapositiva para el **login** o para la **autenticación con token** a continuación?

# login

Perfecto, aquí tienes cómo explicar el **proceso de login** en tu frontend Angular, paso a paso para tus diapositivas:


## 1. **Formulario HTML (login.html)**
- El usuario ingresa su nombre de usuario y contraseña.
- El formulario está enlazado a las variables `username` y `password` del componente usando `ngModel`.
- Al enviar el formulario, se llama al método `onSubmit()`.


## 2. **Componente Angular (login.ts)**
- El método `onSubmit()`:
  - Llama al servicio `auth.login()` enviando usuario y contraseña.
  - Si el login es exitoso, guarda el token recibido con `auth.saveToken()`.
  - Luego, obtiene los datos del usuario autenticado con `auth.getCurrentUser()`.
  - Según el tipo de usuario (`restaurante` o `cliente`), redirige a la vista correspondiente.
  - Si hay error, muestra un mensaje.

```typescript
onSubmit() {
  this.auth.login({ username: this.username, password: this.password }).subscribe({
    next: (res) => {
      this.auth.saveToken(res.access);
      this.auth.getCurrentUser().subscribe({
        next: (user) => {
          if (user.tipo === 'restaurante') {
            this.router.navigate(['/restaurants/menu-dia']);
          } else {
            this.router.navigate(['/clientes/explorador-restaurantes']);
          }
        }
      });
    },
    error: () => {
      this.error = 'Usuario o contraseña incorrectos';
    }
  });
}
```


## 3. **Servicio Auth (auth.ts)**
- El método `login()` hace una petición POST a `/auth/jwt/create/` en el backend Django.
- Si las credenciales son correctas, el backend responde con un **token JWT**.
- El método `saveToken()` guarda el token en el navegador (localStorage).
- El método `getCurrentUser()` obtiene los datos del usuario autenticado usando el token.


## 4. **Conexión con el backend Django**
- El endpoint `/auth/jwt/create/` valida las credenciales y responde con el token.
- El endpoint `/auth/users/me/` devuelve los datos del usuario autenticado (usando el token).


## 5. **Resumen visual del flujo**
```
Usuario (HTML) → LoginComponent (onSubmit) → AuthService (login) → Django API (/auth/jwt/create/)
↓
Recibe token → Guarda token → Pide usuario actual (/auth/users/me/) → Redirige según tipo
```


¿Quieres que te ayude con la diapositiva de **cómo se usa el token para proteger rutas** o el flujo de autenticación en Angular?

# menu-dia
¡Perfecto! Aquí tienes cómo explicar el **apartado "Menú del Día"** desde el HTML hasta el backend, ideal para tus diapositivas:


## 1. **HTML (menu-dia.html)**
- Muestra el nombre e imagen del restaurante.
- Permite agregar, editar y eliminar entradas y segundos del menú.
- Usa formularios enlazados a variables del componente con `ngModel`.
- Botones para guardar, cancelar, eliminar y navegar a otras secciones (historial, pedidos del día).


## 2. **Componente Angular (menu-dia.ts)**
- Al iniciar (`ngOnInit`), carga los datos del restaurante y el menú del día.
- Métodos principales:
  - **cargarRestaurante()**: Obtiene los datos del restaurante del usuario autenticado.
  - **cargarMenus()**: Obtiene el menú del día del restaurante.
  - **cargarEntradas() / cargarSegundos()**: Obtienen las listas de platos.
  - **agregarEntrada() / agregarSegundo()**: Permiten agregar nuevos platos usando `FormData` para enviar imágenes.
  - **editar/guardar/cancelar/eliminar**: Permiten modificar o borrar platos.
  - **logout()**: Cierra sesión eliminando el token.


## 3. **Servicio Angular (restaurant.service.ts)**
- Métodos para interactuar con la API:
  - `getRestaurantePorUsuario(userId)`
  - `getMenuHoy(restauranteId)`
  - `getEntradas(menuId)`, `addEntrada(formData)`, `updateEntrada(id, data)`, `deleteEntrada(id)`
  - Lo mismo para segundos.
- Usa el token JWT en los headers (gracias al interceptor).


## 4. **Conexión con el backend Django**
- **Endpoints típicos:**
  - `/api/restaurantes/<user_id>/` → Devuelve datos del restaurante.
  - `/api/menus/hoy/<restaurante_id>/` → Devuelve el menú del día.
  - `/api/entradas/<menu_id>/` → CRUD de entradas.
  - `/api/segundos/<menu_id>/` → CRUD de segundos.
- El backend valida el token JWT y responde con los datos o realiza las acciones solicitadas.


## 5. **Resumen visual del flujo**
```
HTML (formularios y botones)
    ↓
Componente Angular (menu-dia.ts)
    ↓
Servicio Angular (restaurant.service.ts)
    ↓
API Django (endpoints protegidos con JWT)
    ↓
Base de datos (modelos de restaurante, menú, platos)
```


¿Quieres ejemplos de código HTML o del servicio para agregar a tus diapositivas? ¿O prefieres un diagrama de flujo visual?


# restaurantes/pedidos-dia
Aquí tienes un **resumen del flujo y los métodos principales** del componente `restaurants/pedidos-dia` para tus diapositivas:


## ¿Qué hace el componente?
- Muestra los **pedidos pendientes** del restaurante para el día.
- Permite **aceptar** o **rechazar** pedidos.
- Muestra información básica de cada pedido (cliente, platos, imágenes, total).


## Flujo principal

1. **Al iniciar (`ngOnInit`)**  
   - Obtiene el usuario autenticado.
   - Busca el restaurante asociado a ese usuario.
   - Carga los pedidos pendientes del restaurante.

2. **Mostrar pedidos**  
   - Cada pedido muestra nombre del cliente, platos, imágenes y total.

3. **Aceptar o rechazar pedido**  
   - Al aceptar/rechazar, se actualiza el estado del pedido en el backend y se elimina de la lista en pantalla.

4. **Navegación y sesión**  
   - Métodos para ir al historial, menú del día y cerrar sesión.


## Métodos principales (resumidos)

````typescript
ngOnInit() {
  this.auth.getCurrentUser().subscribe(user => {
    this.restaurantService.getRestaurantePorUsuario(user.id).subscribe(restaurante => {
      this.restauranteId = restaurante.id;
      this.cargarPedidos();
    });
  });
}

cargarPedidos() {
  this.cargando = true;
  this.restaurantService.getPedidosPendientesRestaurante(this.restauranteId).subscribe(pedidos => {
    this.pedidos = pedidos.map(p => ({
      id: p.id,
      cliente: p.cliente_nombre || p.cliente || 'Desconocido',
      entradaNombre: p.entrada?.nombre || 'Sin entrada',
      segundoNombre: p.segundo?.nombre || 'Sin segundo',
      total: (p.entrada?.precio || 0) + (p.segundo?.precio || 0)
    }));
    this.cargando = false;
  });
}

aceptarPedido(pedidoId: number) {
  this.restaurantService.updateEstadoPedido(pedidoId, 'aceptado').subscribe(() => {
    this.pedidos = this.pedidos.filter(p => p.id !== pedidoId);
  });
}

rechazarPedido(pedidoId: number) {
  this.restaurantService.updateEstadoPedido(pedidoId, 'rechazado').subscribe(() => {
    this.pedidos = this.pedidos.filter(p => p.id !== pedidoId);
  });
}

logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
````


## Servicios usados

- **getRestaurantePorUsuario(userId)**
- **getPedidosPendientesRestaurante(restauranteId)**
- **updateEstadoPedido(pedidoId, estado)**


¿Quieres también el resumen de los endpoints del backend que usa este componente?

# restaurants/historial
Aquí tienes un **resumen del flujo y los métodos principales** del componente `restaurants/historial` para tus diapositivas:


## ¿Qué hace el componente?
- Muestra el **historial de pedidos** del restaurante (aceptados, rechazados, entregados, etc.).
- Permite **filtrar** o **buscar** pedidos por fecha o estado.
- Permite **imprimir recibos** de los pedidos.


## Flujo principal

1. **Al iniciar (`ngOnInit`)**
   - Obtiene el usuario autenticado.
   - Busca el restaurante asociado a ese usuario.
   - Carga el historial de pedidos del restaurante.

2. **Mostrar historial**
   - Lista todos los pedidos con información relevante (cliente, platos, estado, fecha, total).

3. **Imprimir recibo**
   - Al hacer clic en "Imprimir", genera un PDF con los datos del pedido usando una librería como `jsPDFInvoiceTemplate`.

4. **Navegación y sesión**
   - Métodos para ir al menú del día, pedidos del día y cerrar sesión.


## Métodos principales (resumidos)

````typescript
ngOnInit() {
  this.auth.getCurrentUser().subscribe(user => {
    this.restaurantService.getRestaurantePorUsuario(user.id).subscribe(restaurante => {
      this.restauranteId = restaurante.id;
      this.cargarHistorial();
    });
  });
}

cargarHistorial() {
  this.cargando = true;
  this.restaurantService.getHistorialPedidosRestaurante(this.restauranteId).subscribe(pedidos => {
    this.pedidos = pedidos;
    this.cargando = false;
  });
}

imprimirRecibo(pedido: any) {
  // Prepara los datos y llama a jsPDFInvoiceTemplate(props)
}

logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
````


## Servicios usados

- **getRestaurantePorUsuario(userId)**
- **getHistorialPedidosRestaurante(restauranteId)**


¿Quieres también el código de los servicios usados o un ejemplo del método para imprimir recibo?

# clientes/explorador-restaurantes

Aquí tienes un **resumen del flujo y los métodos principales** del componente `clientes/explorador-restaurantes` para tus diapositivas:


## ¿Qué hace el componente?
- Permite a los **clientes explorar y buscar restaurantes** disponibles.
- Muestra una lista de restaurantes y permite filtrar por nombre.
- Permite seleccionar un restaurante para ver su menú.
- Permite navegar a "Mis pedidos" y cerrar sesión.


## Flujo principal

1. **Al iniciar (`ngOnInit`)**
   - Verifica si el usuario está autenticado (token).
   - Obtiene el usuario actual y muestra su nombre.
   - Carga la lista de restaurantes desde el backend.

2. **Mostrar y filtrar restaurantes**
   - Muestra todos los restaurantes en pantalla.
   - Permite buscar por nombre usando el método `filtrarRestaurantes()`.

3. **Seleccionar restaurante**
   - Al hacer clic en un restaurante, navega a la vista del menú de ese restaurante.

4. **Navegación y sesión**
   - Métodos para ir a "Mis pedidos" y cerrar sesión.


## Métodos principales (resumidos)

````typescript
ngOnInit() {
  if (!this.auth.getToken()) {
    this.router.navigate(['/login']);
    return;
  }
  this.auth.getCurrentUser().subscribe(user => {
    this.nombreUsuario = user.username;
  }, error => {
    this.auth.logout();
    this.router.navigate(['/login']);
  });
  this.cargarRestaurantes();
}

cargarRestaurantes() {
  this.clienteService.getRestaurantes().subscribe({
    next: (restaurantes) => {
      this.restaurantes = restaurantes;
      this.restaurantesFiltrados = restaurantes;
    },
    error: () => {
      this.auth.logout();
      this.router.navigate(['/login']);
    }
  });
}

filtrarRestaurantes() {
  const termino = this.busqueda.trim().toLowerCase();
  this.restaurantesFiltrados = this.restaurantes.filter(r =>
    r.nombre.toLowerCase().includes(termino)
  );
}

seleccionarRestaurante(restaurante: any) {
  this.router.navigate(['/clientes/menu-restaurante', restaurante.id]);
}

irAMisPedidos() {
  this.router.navigate(['/clientes/mis-pedidos']);
}

logout() {
  this.auth.logout();
  this.router.navigate(['/login']);
}
````


## Servicios usados

- **getRestaurantes()** (del `ClienteService`)
- **getCurrentUser()** y **logout()** (del `Auth`)


¿Quieres también el código del servicio `ClienteService` usado para obtener los restaurantes?

# clientes/menu-restaurante

Aquí tienes un **resumen del flujo y los métodos principales** del componente `clientes/menu-restaurante` para tus diapositivas:


## ¿Qué hace el componente?
- Permite al cliente **ver el menú del día** de un restaurante específico.
- Muestra las **entradas** y **segundos** disponibles.
- Permite seleccionar **una entrada y un segundo** para armar un pedido.
- Calcula el **total** del pedido.
- Permite **realizar el pedido** y navegar a la confirmación.


## Flujo principal

1. **Al iniciar (`ngOnInit`)**
   - Verifica si el usuario está autenticado.
   - Obtiene el ID del restaurante desde la URL.
   - Carga los datos del restaurante y su menú del día.

2. **Mostrar menú**
   - Muestra las entradas y segundos disponibles para el menú del día.

3. **Seleccionar platos**
   - El cliente puede seleccionar solo una entrada y un segundo.
   - Se actualiza el panel de pedido y el total.

4. **Realizar pedido**
   - Al hacer clic en "Realizar pedido", se envía el pedido al backend.
   - Si es exitoso, navega a la página de confirmación del pedido.


## Métodos principales (resumidos)

````typescript
ngOnInit() {
  if (!this.auth.getToken()) {
    this.router.navigate(['/login']);
    return;
  }
  this.restauranteId = Number(this.route.snapshot.paramMap.get('id'));
  this.cargarRestaurante();
}

cargarRestaurante() {
  this.clienteService.getRestauranteDetalle(this.restauranteId).subscribe({
    next: (restaurante) => {
      this.restaurante = restaurante;
      this.cargarMenuDelDia();
    },
    error: () => {
      this.router.navigate(['/clientes/explorador-restaurantes']);
    }
  });
}

cargarMenuDelDia() {
  this.clienteService.getMenuHoy(this.restauranteId).subscribe({
    next: (menu) => {
      this.menuDelDia = menu;
      this.cargarPlatos(menu.id);
    },
    error: () => {
      this.menuDelDia = null;
    }
  });
}

cargarPlatos(menuId: number) {
  this.clienteService.getEntradas(menuId).subscribe(entradas => this.entradas = entradas);
  this.clienteService.getSegundos(menuId).subscribe(segundos => this.segundos = segundos);
}

seleccionarEntrada(entrada: any) {
  this.entradaSeleccionadaId = this.entradaSeleccionadaId === entrada.id ? null : entrada.id;
  this.actualizarPanelPedido();
}

seleccionarSegundo(segundo: any) {
  this.segundoSeleccionadoId = this.segundoSeleccionadoId === segundo.id ? null : segundo.id;
  this.actualizarPanelPedido();
}

actualizarPanelPedido() {
  this.pedidoPlatos = [];
  this.totalPedido = 0;
  // Agrega entrada y segundo seleccionados al panel y suma el total
}

realizarPedido() {
  if (!this.entradaSeleccionadaId || !this.segundoSeleccionadoId) {
    alert('Debes seleccionar una entrada y un segundo.');
    return;
  }
  const data = {
    menu: this.menuDelDia.id,
    entrada: this.entradaSeleccionadaId,
    segundo: this.segundoSeleccionadoId
  };
  this.clienteService.crearPedido(data).subscribe({
    next: (pedido) => {
      this.router.navigate(['/clientes/confirmacion-pedido', pedido.id]);
    },
    error: () => {
      alert('Error al realizar el pedido.');
    }
  });
}
````


## Servicios usados

- **getRestauranteDetalle(id)**
- **getMenuHoy(restauranteId)**
- **getEntradas(menuId)**
- **getSegundos(menuId)**
- **crearPedido(data)**

¿Quieres también el código de estos servicios?

# clientes/confirmacion-pedido

Aquí tienes el **resumen del flujo y los métodos principales** del componente `clientes/confirmacion-pedido` para tus diapositivas:


## ¿Qué hace el componente?
- Muestra al cliente el **estado de su pedido** después de realizarlo.
- Hace **polling** (consulta periódica) al backend para saber si el pedido fue aceptado o rechazado.
- Muestra mensajes según el estado y redirige automáticamente a "Mis pedidos".


## Flujo principal

1. **Al iniciar (`ngOnInit`)**
   - Verifica si el usuario está autenticado.
   - Obtiene el ID del pedido desde la URL.
   - Llama a `verificarEstadoPedido()` y comienza el polling cada 2 segundos.

2. **Verificar estado del pedido**
   - Llama al servicio `getPedidoDetalle(pedidoId)` para consultar el estado.
   - Si el estado es:
     - **pendiente:** Muestra mensaje de espera.
     - **aceptado:** Muestra mensaje de éxito, detiene el polling y redirige a "Mis pedidos" después de 5 segundos.
     - **rechazado:** Muestra mensaje de rechazo, detiene el polling y redirige a "Mis pedidos" después de 5 segundos.
   - Si hay error, muestra mensaje de error y redirige.

3. **Al destruir el componente (`ngOnDestroy`)**
   - Detiene el polling para evitar llamadas innecesarias.


## Métodos principales (resumidos)

````typescript
ngOnInit() {
  if (!this.auth.getToken()) {
    this.router.navigate(['/login']);
    return;
  }
  this.pedidoId = Number(this.route.snapshot.paramMap.get('id'));
  this.verificarEstadoPedido();
  this.pollingInterval = setInterval(() => this.verificarEstadoPedido(), 2000);
}

verificarEstadoPedido() {
  this.clienteService.getPedidoDetalle(this.pedidoId).subscribe({
    next: pedido => {
      if (pedido.estado === 'pendiente') {
        this.estado = 'loading';
      } else if (pedido.estado === 'aceptado') {
        this.estado = 'aceptado';
        this.mensaje = '¡Pedido aceptado! Tu pedido está en camino 🍽️';
        clearInterval(this.pollingInterval);
        setTimeout(() => this.router.navigate(['/clientes/mis-pedidos']), 5000);
      } else if (pedido.estado === 'rechazado') {
        this.estado = 'rechazado';
        this.mensaje = 'Pedido rechazado. Lo sentimos, tu pedido no pudo ser procesado.';
        clearInterval(this.pollingInterval);
        setTimeout(() => this.router.navigate(['/clientes/mis-pedidos']), 5000);
      }
    },
    error: () => {
      this.estado = 'rechazado';
      this.mensaje = 'No se pudo consultar el estado del pedido.';
      clearInterval(this.pollingInterval);
      setTimeout(() => this.router.navigate(['/clientes/mis-pedidos']), 5000);
    }
  });
}

ngOnDestroy() {
  if (this.pollingInterval) clearInterval(this.pollingInterval);
}
````


## Servicio usado

````typescript
// En ClienteService
getPedidoDetalle(pedidoId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}pedidos/${pedidoId}/`);
}
````


**Resumen:**  
Este componente consulta periódicamente el estado del pedido y muestra al cliente si fue aceptado o rechazado, redirigiendo automáticamente después de mostrar el resultado.

# clientes/mis-pedidos

Aquí tienes el **resumen del flujo y los métodos principales** del componente `clientes/mis-pedidos` para tus diapositivas:


## ¿Qué hace el componente?
- Muestra al cliente **todos sus pedidos realizados**.
- Permite ver el **estado** de cada pedido (pendiente, aceptado, rechazado, entregado, etc.).
- Muestra detalles como fecha, restaurante, platos y total.
- (Opcional) Permite filtrar o buscar pedidos.


## Flujo principal

1. **Al iniciar (`ngOnInit`)**
   - Verifica si el usuario está autenticado.
   - Obtiene el usuario actual.
   - Llama al servicio para cargar todos los pedidos del cliente.

2. **Mostrar pedidos**
   - Lista todos los pedidos con información relevante: restaurante, platos, estado, fecha, total.

3. **Navegación y sesión**
   - Métodos para volver al explorador de restaurantes o cerrar sesión.


## Métodos principales (resumidos)

````typescript
ngOnInit() {
  if (!this.auth.getToken()) {
    this.router.navigate(['/login']);
    return;
  }
  this.auth.getCurrentUser().subscribe(user => {
    this.cargarMisPedidos(user.id);
  });
}

cargarMisPedidos(userId: number) {
  this.clienteService.getPedidosPorCliente(userId).subscribe({
    next: pedidos => {
      this.pedidos = pedidos;
    },
    error: () => {
      this.pedidos = [];
    }
  });
}

irAExplorador() {
  this.router.navigate(['/clientes/explorador-restaurantes']);
}

logout() {
  this.auth.logout();
  this.router.navigate(['/login']);
}
````


## Servicios usados

````typescript
// En ClienteService
getPedidosPorCliente(clienteId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}clientes/${clienteId}/pedidos/`);
}
````


**Resumen:**  
Este componente permite al cliente ver el historial y estado de todos sus pedidos, facilitando el seguimiento y la navegación dentro de la app.