const Product = require('../../models/Product');
const fs = require('fs');
const crypto = require('crypto');

// Función para calcular el hash de la imagen
const calculateHash = (filePath) => {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);

        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', (err) => reject(err));
    });
};

// Crear un producto con opciones personalizables
exports.createProductWithCustomOptions = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body); // Verificar datos
        console.log('Archivos recibidos:', req.files); // Para imágenes

        const { name, description, price, category } = req.body;

        // Validar campos obligatorios
        if (!name || !description) {
            return res.status(400).json({
                message: "Los campos 'name' y 'description' son obligatorios.",
            });
        }

        // Manejar customOptions con nombre potencialmente malformado
        const rawCustomOptions = req.body['customOptions\t'] || req.body.customOptions; 
        const parsedCustomOptions = rawCustomOptions ? JSON.parse(rawCustomOptions) : [];

        // Crear producto
        const product = await Product.create({
            name,
            description,
            price,
            category,
            customOptions: parsedCustomOptions,
        });

        res.status(201).json({ message: 'Producto creado con éxito', product });
    } catch (error) {
        console.error('Error al crear producto:', error); // Log detallado
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
};



// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los productos' });
    }
};

// Obtener información de un producto específico
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

// Actualizar un producto (solo para administradores)
exports.updateProduct = async (req, res) => {
    try {
        const { uuid } = req.params;
        const { name, description, price, customOptions } = req.body;

        // Verificar si el usuario es administrador
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para actualizar productos' });
        }

        // Buscar el producto por UUID
        const product = await Product.findOne({ uuid });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Actualizar los campos del producto
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (customOptions) product.customOptions = JSON.parse(customOptions);

        // Manejar la subida de una nueva imagen
        if (req.file) {
            const imagePath = `/uploads/${req.file.filename}`;
            const imageHash = await calculateHash(req.file.path);

            // Verificar si la nueva imagen ya existe en la base de datos
            const existingProduct = await Product.findOne({ imageHash });
            if (existingProduct && existingProduct.uuid !== uuid) {
                // Eliminar la imagen duplicada del servidor
                fs.unlink(req.file.path, (err) => {
                    if (err) console.error('Error al eliminar la imagen duplicada:', err);
                });
                return res.status(400).json({ message: 'La imagen ya existe en otro producto' });
            }

            // Eliminar la imagen anterior si se sube una nueva
            if (product.imagePath) {
                fs.unlink(`.${product.imagePath}`, (err) => {
                    if (err) console.error('Error al eliminar la imagen anterior:', err);
                });
            }

            // Actualizar la nueva ruta de la imagen y el hash
            product.imagePath = imagePath;
            product.imageHash = imageHash;
        }

        // Guardar los cambios en la base de datos
        await product.save();

        res.status(200).json({
            message: 'Producto actualizado exitosamente',
            product
        });
    } catch (err) {
        console.error('Error al actualizar el producto:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Eliminar un producto por UUID
exports.deleteProduct = async (req, res) => {
    try {
        const { uuid } = req.params;

        // Buscar el producto por UUID
        const product = await Product.findOne({ uuid });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Si el producto tiene una imagen asociada, eliminarla del sistema de archivos
        if (product.imagePath) {
            fs.unlink(`.${product.imagePath}`, (err) => {
                if (err) {
                    console.error('Error al eliminar la imagen del servidor:', err);
                }
            });
        }

        // Eliminar el producto de la base de datos
        await Product.deleteOne({ uuid });

        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar el producto:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
