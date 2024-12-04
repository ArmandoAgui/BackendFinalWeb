const User = require('../../models/User'); // Modelo de usuario

// Obtener información del perfil
exports.getProfile = async (req, res) => {
    try {
        const { uuid: userUuid } = req.user; // Extraer el UUID del usuario autenticado

        // Buscar el usuario en la base de datos
        const user = await User.findOne({ uuid: userUuid });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // Devolver los datos del usuario
        res.status(200).json({
            name: user.name,
            email: user.email,
            address: user.address,
        });
    } catch (error) {
        console.error('Error al obtener el perfil:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};

// Editar información del perfil
exports.updateProfile = async (req, res) => {
    try {
        const { uuid: userUuid } = req.user; // Extraer el UUID del usuario autenticado
        const { name, email } = req.body; // Datos enviados desde el frontend

        // Validar datos
        if (!name || !email ) {
            return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
        }

        // Actualizar los datos del usuario
        const user = await User.findOneAndUpdate(
            { uuid: userUuid },
            { name, email },
            { new: true } // Devolver el documento actualizado
        );

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        res.status(200).json({
            message: 'Perfil actualizado con éxito.',
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};