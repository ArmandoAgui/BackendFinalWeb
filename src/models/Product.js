const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ProductSchema = new mongoose.Schema({
    uuid: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
        type: String,
        enum: [
            "Tecnologia",
            "Moda",
            "Hogar",
            "Belleza",
            "Salud",
            "Accesorios",
            "Deportes al Aire Libre",
            "Juguetes",
            "Entretenimiento"
        ],
        required: true,
        default: "Tecnologia", // Puedes establecer una categoría por defecto
    },
    customOptions: {
        type: [
            {
                type: { type: String, required: true }, // Ejemplo: "color", "talla", "texto", "imagen"
                name: { type: String, required: true }, // Nombre del campo, ejemplo: "Color"
                options: { type: [String], default: [] }, // Opciones disponibles (ejemplo: ["Rojo", "Azul"])
                maxLength: { type: Number }, // Para texto personalizado (ejemplo: 50 caracteres)
                maxFileSize: { type: Number }, // Para imágenes (ejemplo: 2 MB)
                allowedExtensions: { type: [String], default: [] } // Extensiones permitidas para imágenes (ejemplo: [".jpg", ".png"])
            }
        ],
        default: []
    },
    imagePath: { type: String, default: '' },
    imageHash: { type: String, unique: true }
});

module.exports = mongoose.model('Product', ProductSchema);
