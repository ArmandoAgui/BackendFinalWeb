# Mi Tienda Online
API RESTful para una tienda en línea con productos personalizables.

## Endpoints
Lista de Endpoints
# 1. Autenticación de Cliente
POST /api/client/register - Registrar un nuevo cliente
POST /api/client/login - Iniciar sesión como cliente
# 2. Perfil de Cliente
GET /api/client/profile - Ver perfil del cliente
PUT /api/client/profile - Actualizar perfil del cliente
# 3. Catálogo de Productos (Cliente)
GET /api/client/products - Ver todos los productos
GET /api/client/products/:uuid - Ver detalles de un producto específico
# 4. Órdenes (Cliente)
POST /api/client/order - Crear una nueva orden
GET /api/client/orders - Ver todas las órdenes del cliente
GET /api/client/orders/:uuid - Ver detalles de una orden específica
# 5. Autenticación de Administrador
POST /api/admin/login - Iniciar sesión como administrador
# 6. Gestión de Usuarios Administradores
POST /api/admin/admin-users - Crear un nuevo usuario administrador
GET /api/admin/admin-users - Ver todos los usuarios administradores
GET /api/admin/admin-users/:uuid - Ver detalles de un usuario administrador
PUT /api/admin/admin-users/:uuid - Actualizar un usuario administrador
DELETE /api/admin/admin-users/:uuid - Eliminar un usuario administrador
# 7. Gestión de Usuarios Clientes
GET /api/admin/clients - Ver todos los clientes
GET /api/admin/clients/:uuid - Ver detalles de un cliente
PATCH /api/admin/clients/:uuid/status - Actualizar estado de un cliente
# 8. Gestión de Productos (Administrador)
POST /api/admin/products - Crear un nuevo producto
GET /api/admin/products - Ver todos los productos
GET /api/admin/products/:uuid - Ver detalles de un producto
PUT /api/admin/products/:uuid - Actualizar un producto
DELETE /api/admin/products/:uuid - Eliminar un producto
# 9. Gestión de Órdenes (Administrador)
GET /api/admin/orders - Ver todas las órdenes
GET /api/admin/orders/:uuid - Ver detalles de una orden
PATCH /api/admin/orders/:uuid/status - Actualizar estado de una orden

## Instalación
1. Instalar dependencias: `npm install`
2. Iniciar servidor: `npm start`


## Dependencias

"dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^6.9.1",
    "morgan": "^1.10.0",
    "multer": "^1.4.5"
}
