const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Crear un nuevo usuario administrador
exports.createAdminUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Validar entrada directamente con las reglas
      if (!name || !email || !password) {
        return res.status(400).json({
          message: 'Todos los campos son requeridos: nombre, email y contraseña.',
        });
      }
  
      // Comprobar si el correo ya está registrado
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'El correo ya está registrado.' });
      }
  
      // Verificar que la contraseña cumpla con los requisitos
      if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).json({
          message:
            'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.',
        });
      }
  
      // Cifrar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Crear el nuevo administrador
      const newUser = await User.create({
        uuid: uuidv4(),
        name,
        email,
        password: hashedPassword,
        role: 'admin',
      });
  
      // Respuesta exitosa
      res.status(201).json({
        message: 'Administrador creado exitosamente.',
        user: {
          uuid: newUser.uuid,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ message: 'Datos inválidos.', error: err });
      }
      console.error('Error al crear usuario administrador:', err);
      res.status(500).json({ message: 'Error interno del servidor.' });
    }
  };

// Obtener todos los usuarios administradores
exports.getAllAdminUsers = async (req, res) => {
    try {
        // Filtrar usuarios con rol 'admin'
        const adminUsers = await User.find({ role: 'admin' }, '-password');
        res.status(200).json(adminUsers);
    } catch (err) {
        console.error('Error al obtener usuarios administradores:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


// Obtener un usuario administrador específico
exports.getAdminUserByUuid = async (req, res) => {
    try {
        const { uuid } = req.params;
        const adminUser = await User.findOne({ uuid, role: 'admin' }, '-password');
        if (!adminUser) {
            return res.status(404).json({ message: 'Usuario administrador no encontrado' });
        }
        res.status(200).json(adminUser);
    } catch (err) {
        console.error('Error al obtener usuario administrador:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Actualizar un usuario administrador
exports.updateAdminUser = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { name, email, password } = req.body;

        const updates = { name, email };
        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findOneAndUpdate(
            { uuid, role: 'admin' },
            updates,
            { new: true, select: '-password' }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario administrador no encontrado' });
        }

        res.status(200).json({
            message: 'Usuario administrador actualizado exitosamente',
            user: updatedUser
        });
    } catch (err) {
        console.error('Error al actualizar usuario administrador:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Eliminar un usuario administrador
exports.deleteAdminUser = async (req, res) => {
    try {
        const { uuid } = req.params;
        const deletedUser = await User.findOneAndDelete({ uuid, role: 'admin' });

        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuario administrador no encontrado' });
        }

        res.status(200).json({ message: 'Usuario administrador eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar usuario administrador:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
