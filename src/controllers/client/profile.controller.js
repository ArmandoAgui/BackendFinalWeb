const User = require('../../models/User');

// Obtener el perfil del usuario
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findOne({ uuid: req.user.uuid });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener el perfil' });
    }
};

// Actualizar el perfil del usuario
exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findOneAndUpdate(
            { uuid: req.user.uuid },
            { username, email },
            { new: true }
        );
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
};
