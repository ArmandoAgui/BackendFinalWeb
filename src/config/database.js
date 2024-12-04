const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,      // Maneja URL de conexión moderna
            useUnifiedTopology: true,  // Maneja el motor de monitoreo
        });
        console.log('Conectado a MongoDB');
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err.message);
        process.exit(1); // Detener la ejecución en caso de error crítico
    }
};

// Escucha eventos de la conexión (Opcional, para debug)
mongoose.connection.on('connected', () => {
    console.log('Mongoose conectado a la base de datos');
});

mongoose.connection.on('error', (err) => {
    console.error('Error en la conexión de Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose desconectado');
});

module.exports = connectDB;
