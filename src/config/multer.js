const multer = require('multer');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Configuración del almacenamiento con hashing del nombre del archivo
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Generar un hash para el nombre del archivo usando SHA-256
        const hash = crypto.createHash('sha256').update(file.originalname + Date.now().toString()).digest('hex');
        const fileExtension = path.extname(file.originalname);
        cb(null, `${hash}${fileExtension}`);
    }
});

// Crear la instancia de multer
const upload = multer({ storage });

module.exports = upload;
