const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Auto-cleanup uploads directory every 15 minutes
setInterval(() => {
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) return;
    
    fs.readdir(uploadsDir, (err, files) => {
        if (err) return console.error('Error reading uploads for cleanup:', err);
        const now = Date.now();
        files.forEach(file => {
            if (file === '.gitkeep') return;
            const filePath = path.join(uploadsDir, file);
            fs.stat(filePath, (err, stats) => {
                if (err) return;
                // Delete if older than 30 minutes
                if (now - stats.mtimeMs > 30 * 60 * 1000) {
                    fs.unlink(filePath, err => {
                        if (err) console.error('Failed to cleanup file:', filePath, err);
                    });
                }
            });
        });
    });
}, 15 * 60 * 1000);

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
