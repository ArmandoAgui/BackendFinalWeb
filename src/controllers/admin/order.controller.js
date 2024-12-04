const Order = require('../../models/Order');

// Obtener todas las órdenes con paginación
exports.getAllOrders = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const orders = await Order.find()
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las órdenes' });
    }
};

// Actualizar el estado de una orden (solo administrador)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { status } = req.body;

        // Verificar si el estado proporcionado es válido
        const validStatuses = ['Pending', 'Shipped', 'Delivered'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}` });
        }

        // Buscar la orden
        const order = await Order.findOne({ uuid });
        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        // Actualizar el estado de la orden
        order.status = status;
        await order.save();

        res.status(200).json({
            message: 'Estado de la orden actualizado exitosamente',
            order
        });
    } catch (err) {
        console.error('Error al actualizar el estado de la orden:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener información de una orden específica
exports.getOrderById = async (req, res) => {
    try {
        const { uuid } = req.params;
        const order = await Order.findOne({ uuid });

        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        res.json(order);
    } catch (err) {
        console.error('Error al obtener la orden:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener las últimas 10 órdenes
exports.getLastOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 }) // Orden descendente por fecha de creación
            .limit(10); // Limitar a las últimas 10 órdenes

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};