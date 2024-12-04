const Order = require('../../models/Order');
const Product = require('../../models/Product');

exports.addToCart = async (req, res) => {
    try {
        const { productUuid, quantity, customOptions } = req.body; // Datos enviados desde el frontend
        const { uuid: userUuid } = req.user; // Extraer el UUID del usuario desde el token

        // Verificar si el producto existe
        const product = await Product.findOne({ uuid: productUuid });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Buscar una orden con estado 'Cart' para el usuario
        let cartOrder = await Order.findOne({ userUuid, status: 'Cart' });

        if (!cartOrder) {
            // Si no existe, crear una nueva orden en estado 'Cart'
            cartOrder = new Order({
                userUuid,
                status: 'Cart',
                products: [],
            });
        }

        // Verificar si el producto ya está en la orden con las mismas opciones de personalización
        const existingProductIndex = cartOrder.products.findIndex(
            (item) =>
                item.productUuid === productUuid &&
                JSON.stringify(item.customOptions) === JSON.stringify(customOptions)
        );

        if (existingProductIndex > -1) {
            // Si el producto ya existe con las mismas opciones, actualizar la cantidad
            cartOrder.products[existingProductIndex].quantity += quantity;
        } else {
            // Si no existe, agregar el producto al carrito con las opciones de personalización
            cartOrder.products.push({
                productUuid,
                quantity,
                customOptions, // Agregar las opciones de personalización
                name: product.name,
                price: product.price,
                image: product.imagePath || '',
            });
        }

        // Guardar la orden actualizada
        await cartOrder.save();

        res.status(200).json({ message: 'Producto agregado al carrito', cart: cartOrder });
    } catch (error) {
        console.error('Error en addToCart:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};



exports.getCart = async (req, res) => {
    try {
        const { uuid: userUuid } = req.user;

        // Buscar la orden con estado 'Cart' del usuario
        const cartOrder = await Order.findOne({ userUuid, status: 'Cart' });
        if (!cartOrder) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Enriquecer los datos de los productos con información adicional
        const productsWithDetails = await Promise.all(
            cartOrder.products.map(async (item) => {
                const product = await Product.findOne({ uuid: item.productUuid });

                return {
                    productUuid: item.productUuid,
                    quantity: item.quantity,
                    customOptions: item.customOptions,
                    name: product?.name || 'Nombre no disponible',
                    price: product?.price || 0,
                    image: product?.imagePath || 'https://via.placeholder.com/150',
                };
            })
        );

        res.status(200).json({ ...cartOrder.toObject(), products: productsWithDetails });
    } catch (error) {
        console.error('Error al obtener el carrito:', error);
        res.status(500).json({ message: 'Error interno del servidor', error: error.message });
    }
};

exports.updateCart = async (req, res) => {
    const { userUuid, productUuid, quantity } = req.body;

    try {
        const cart = await Order.findOne({ userUuid, status: 'Cart' });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.productUuid === productUuid);
        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();

        res.status(200).json(cart);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al actualizar el carrito' });
    }
};


exports.removeProductFromCart = async (req, res) => {
    try {
        const userUuid = req.params.userUuid;
        const productUuid = req.params.productUuid;

        // Busca el carrito del usuario
        const cart = await Order.findOne({ userUuid, status: 'Cart' });
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Filtra los productos para eliminar el producto especificado
        cart.products = cart.products.filter(product => product.productUuid !== productUuid);

        // Guarda el carrito actualizado
        await cart.save();

        // Reconstruir el carrito con los detalles de los productos
        const updatedCart = await Order.findOne({ userUuid, status: 'Cart' }).populate('products.productUuid');

        res.status(200).json({ message: 'Producto eliminado', cart: updatedCart });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
        res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
    }
}; 

exports.processOrder = async (req, res) => {
    try {
        const { uuid: userUuid } = req.user; // Extrae el UUID del usuario autenticado

        // Busca el carrito del usuario con estado 'Cart'
        const cart = await Order.findOne({ userUuid, status: 'Cart' });

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado.' });
        }

        // Cambiar el estado del carrito a 'Pending'
        cart.status = 'Pending';
        cart.processedAt = new Date(); // Fecha y hora de procesamiento
        await cart.save();

        res.status(200).json({ message: 'Carrito procesado como orden.', order: cart });
    } catch (error) {
        console.error('Error al procesar el carrito:', error);
        res.status(500).json({ message: 'Error al procesar el carrito.', error: error.message });
    }
};
