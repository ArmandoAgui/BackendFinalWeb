const express = require('express');
const cors = require('cors');
const app = express();

// Configuración de CORS
app.use(
    cors({
        origin: 'http://localhost:5173', // Permitir solicitudes desde tu frontend
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Incluye PATCH
        allowedHeaders: ['Content-Type', 'Authorization'], // Permite encabezados necesarios
    })
);

// Resto de tu código de configuración de Express
app.use(express.json());

app.options('*', cors()); // Permitir solicitudes OPTIONS para todas las rutas

// Inicia el servidor
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));


// Rutas
const clientAuthRoutes = require('./routes/client/clientAuth.routes');
const catalogRoutes = require('./routes/client/catalog.routes');
const profileRoutes = require('./routes/client/profile.routes');
const orderRoutesClient = require('./routes/client/order.routes');
const adminAuthRoutes = require('./routes/admin/adminAuth.routes');
const productRoutes = require('./routes/admin/product.routes');
const orderRoutesAdmin = require('./routes/admin/order.routes');
const adminClientRoutes = require('./routes/admin/client.routes');
const adminUserRoutes = require('./routes/admin/adminUser.routes');
const analyticsRoutes = require('./routes/admin/stats.routes');
const cartRoutes = require('./routes/client/cart.routes');
const errorMiddleware = require('./middleware/error.middleware');

// Rutas del administrador
app.use('/api/admin/auth', adminAuthRoutes); // Registra las rutas de autenticación
app.use('/api/admin/product', productRoutes);
app.use('/api/admin/order', orderRoutesAdmin);
app.use('/api/admin/clients', adminClientRoutes);
app.use('/api/admin/admin-users', adminUserRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
// Rutas del cliente
app.use('/api/client/auth', clientAuthRoutes);
app.use('/api/client/catalog', catalogRoutes);
app.use('/api/client/profile', profileRoutes);
app.use('/api/client/order', orderRoutesClient);
app.use('/api/client/cart', cartRoutes);


module.exports = app;
