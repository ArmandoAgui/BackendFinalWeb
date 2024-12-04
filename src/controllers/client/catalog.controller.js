const Product = require('../../models/Product');
const Order = require('../../models/Order')

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find(); // Obtener todos los productos
        res.json(products); // Enviar la lista completa de productos
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener todos los productos', error: err.message });
    }
};


exports.getProducts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const totalProducts = await Product.countDocuments(); // Total de productos
        const products = await Product.find()
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json({
            products,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: Number(page),
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener productos', error: err.message });
    }
};



// Obtener la información de un producto específico
exports.getProductById = async (req, res) => {
    try {
        const { uuid } = req.params;
        const product = await Product.findOne({ uuid });

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.json(product);
    } catch (err) {
        console.error('Error al obtener el producto:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
