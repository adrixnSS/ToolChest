const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Middleware para servir archivos estáticos
app.use(express.static('public'));

// Ruta principal que sirve el frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const videoRoutes = require('./src/routes/video');
const imageRoutes = require('./src/routes/image');
const pdfRoutes = require('./src/routes/pdf'); // Importar nuevas rutas
app.use('/api/v1/video', videoRoutes);
app.use('/api/v1/image', imageRoutes);
app.use('/api/v1/pdf', pdfRoutes); // Usar nuevas rutas
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Manejo de errores básico
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
