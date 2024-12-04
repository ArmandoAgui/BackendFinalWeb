const Order = require('../../models/Order');
const Product = require('../../models/Product');

// Crear una nueva orden
exports.createOrder = async (req, res) => {
    try {
        const { products } = req.body;
        const userUuid = req.user.uuid;

        // Verificar que los productos existan
        const validProducts = await Product.find({
            uuid: { $in: products.map((p) => p.productUuid) }
        });

        if (validProducts.length !== products.length) {
            return res.status(400).json({ message: 'Uno o más productos no existen' });
        }

        // Crear la orden
        const order = await Order.create({
            userUuid,
            products,
            status: 'Pending'
        });

        res.status(201).json(order);
    } catch (err) {
        console.error('Error al crear la orden:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Obtener todas las órdenes del cliente
exports.getClientOrders = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const orders = await Order.find({ userUuid }).lean();

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No se encontraron órdenes para este cliente' });
        }

        // Calcula el total dinámicamente si no está en la base de datos
        for (const order of orders) {
            if (!order.total) {
                order.total = order.products.reduce((sum, product) => {
                    return sum + (product.price * product.quantity);
                }, 0);
            }
        }

        res.json(orders);
    } catch (err) {
        console.error('Error al obtener las órdenes:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};


// Obtener la información de una orden específica
exports.getOrderById = async (req, res) => {
    try {
        const { uuid } = req.params;
        const order = await Order.findOne({ uuid, userUuid: req.user.uuid });

        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        res.json(order);
    } catch (err) {
        console.error('Error al obtener la orden:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

// Agregar un producto a la orden del cliente
exports.addProductToOrder = async (req, res) => {
    try {
        const userUuid = req.user.uuid;
        const { productUuid, quantity, selectedOptions } = req.body;

        // Validar la cantidad
        if (quantity <= 0) {
            return res.status(400).json({ message: 'La cantidad debe ser mayor a cero' });
        }

        // Buscar el producto
        const product = await Product.findOne({ uuid: productUuid });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Validar las opciones personalizadas seleccionadas
        for (const option of selectedOptions) {
            const productOption = product.customOptions.find(opt => opt.name.toLowerCase() === option.name.toLowerCase());

            if (!productOption) {
                return res.status(400).json({ message: `Opción personalizada inválida: ${option.name}` });
            }

            // Validar el tipo de opción
            if (productOption.type === 'color' || productOption.type === 'material' || productOption.type === 'talla') {
                if (!productOption.options.includes(option.value)) {
                    return res.status(400).json({
                        message: `Opción inválida para ${productOption.name}. Opciones permitidas: ${productOption.options.join(', ')}`
                    });
                }
            }

            // Validar texto personalizado
            if (productOption.type === 'texto') {
                if (option.value.length > productOption.maxLength) {
                    return res.status(400).json({
                        message: `El texto para ${productOption.name} excede el límite de ${productOption.maxLength} caracteres`
                    });
                }
            }

            // Validar imagen personalizada
            if (productOption.type === 'imagen') {
                const fileExtension = option.value.split('.').pop().toLowerCase();
                if (!productOption.allowedExtensions.includes(`.${fileExtension}`)) {
                    return res.status(400).json({
                        message: `La extensión de archivo no es válida para ${productOption.name}. Extensiones permitidas: ${productOption.allowedExtensions.join(', ')}`
                    });
                }

                if (option.size > productOption.maxFileSize) {
                    return res.status(400).json({
                        message: `El archivo para ${productOption.name} excede el tamaño máximo permitido de ${productOption.maxFileSize / 1024 / 1024} MB`
                    });
                }
            }
        }

        // Buscar una orden activa del cliente
        let order = await Order.findOne({ userUuid, status: 'Pending' });

        // Crear una nueva orden si no existe
        if (!order) {
            order = await Order.create({
                userUuid,
                products: [],
                status: 'Pending'
            });
        }

        // Verificar si el producto ya está en la orden
        const existingProduct = order.products.find(item => item.productUuid === productUuid);

        if (existingProduct) {
            // Actualizar la cantidad del producto
            existingProduct.quantity += quantity;
            existingProduct.selectedOptions = selectedOptions;
        } else {
            // Agregar el nuevo producto a la orden
            order.products.push({
                productUuid,
                quantity,
                selectedOptions
            });
        }

        // Guardar la orden actualizada
        await order.save();

        res.status(200).json({
            message: 'Producto agregado a la orden exitosamente',
            order
        });
    } catch (err) {
        console.error('Error al agregar producto a la orden:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
