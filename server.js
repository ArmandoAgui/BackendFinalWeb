const app = require('./src/app');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');

dotenv.config();

// Conectar a la base de datos
connectDB();

