// src/controllers/admin/client.controller.js

const User = require('../../models/User');

// Función para obtener todos los clientes
async function getAllClients(req, res) {
    try {
        const clients = await User.find({ role: 'client' }, '-password');
        res.status(200).json(clients);
    } catch (err) {
        console.error('Error al obtener la lista de clientes:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Función para obtener detalles de un cliente específico
async function getClientByUuid(req, res) {
    try {
        const { uuid } = req.params;
        const client = await User.findOne({ uuid, role: 'client' }, '-password');
        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }
        res.status(200).json(client);
    } catch (err) {
        console.error('Error al obtener detalles del cliente:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Función para actualizar el estado de un cliente
async function updateClientStatus(req, res) {
    try {
        const { uuid } = req.params;
        const { status } = req.body;
        const validStatuses = ['Active', 'Inactive'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}` });
        }

        const client = await User.findOneAndUpdate(
            { uuid, role: 'client' },
            { status },
            { new: true, select: '-password' }
        );

        if (!client) {
            return res.status(404).json({ message: 'Cliente no encontrado' });
        }

        res.status(200).json({
            message: 'Estado del cliente actualizado exitosamente',
            client
        });
    } catch (err) {
        console.error('Error al actualizar el estado del cliente:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

// Exportar las funciones correctamente
module.exports = {
    getAllClients,
    getClientByUuid,
    updateClientStatus
};
