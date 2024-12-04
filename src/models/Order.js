const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ProductInOrderSchema = new mongoose.Schema({
    productUuid: { type: String, required: true },
    quantity: { type: Number, required: true }
});

const OrderSchema = new mongoose.Schema({
    uuid: { type: String, default: uuidv4 },
    userUuid: { type: String, required: true },
    products: [ProductInOrderSchema],
    status: { 
        type: String, 
        enum: ['Cart', 'Pending', 'Shipped', 'Delivered'], 
        required: true, 
        default: 'Cart' // Define 'Cart' como valor predeterminado
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
