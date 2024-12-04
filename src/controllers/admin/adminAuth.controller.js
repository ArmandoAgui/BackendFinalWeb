const User = require('../../models/User');
const jwtUtils = require('../../utils/jwtUtils');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../../middleware/auth.middleware');

// Simulación de lista negra (usa una base de datos en producción)
let tokenBlacklist = [];

exports.registre = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validar que todos los campos estén presentes
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Todos los campos son requeridos: nombre, email y contraseña.' });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El usuario con este email ya existe.' });
        }

        // Crear nuevo usuario administrador
        const hashedPassword = await bcrypt.hash(password, 10); // Encriptar la contraseña
        const newUser = await User.create({
            uuid: uuidv4(), // Generar un UUID único
            name,
            email,
            password: hashedPassword,
            role: 'admin', // Establecer el rol como "admin"
        });

        // Responder con el usuario creado, excluyendo la contraseña
        res.status(201).json({
            message: 'Usuario administrador creado exitosamente.',
            user: {
                uuid: newUser.uuid,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (err) {
        console.error('Error al crear usuario administrador:', err);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// Inicio de sesión de administrador
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Buscar al usuario por email y rol
        const user = await User.findOne({ email, role: 'admin' });
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        // Comparar la contraseña ingresada con la contraseña cifrada
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        // Generar token JWT
        const token = jwtUtils.generateToken(user);
        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (err) {
        console.error('Error en el login:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Cierre de sesión
exports.logout = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token requerido para cerrar sesión' });
    }

    authMiddleware.addToBlacklist(token); // Agrega el token a la lista negra
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

// Middleware para verificar lista negra de tokens
exports.checkBlacklist = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (tokenBlacklist.includes(token)) {
        return res.status(401).json({ message: 'Token inválido, inicia sesión de nuevo' });
    }
    next();
};