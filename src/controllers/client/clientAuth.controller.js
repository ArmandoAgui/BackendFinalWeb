const User = require('../../models/User');
const jwtUtils = require('../../utils/jwtUtils');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validar datos requeridos
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Crear usuario
    const user = await User.create({ name, email, password });

    // Generar token JWT
    const token = jwtUtils.generateToken(user);

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: {
        uuid: user.uuid,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      token,
    });
  } catch (err) {
    console.error('Error al registrar usuario:', err);

    // Manejo de errores específicos
    if (err.code === 11000) {
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
  }
};


exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validar datos requeridos
      if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }
  
      // Buscar usuario por correo
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
  
      // Verificar la contraseña
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciales incorrectas' });
      }
  
      // Generar token JWT
      const token = jwtUtils.generateToken(user);
  
      res.json({
        message: 'Inicio de sesión exitoso',
        user: {
          uuid: user.uuid,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
        },
        token,
      });
    } catch (err) {
      console.error('Error en el inicio de sesión:', err);
      res.status(500).json({ message: 'Error al iniciar sesión' });
    }
  };