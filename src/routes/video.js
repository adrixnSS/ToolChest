const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const multer = require('multer');

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage: storage });

router.post('/mp4-to-mp3', upload.single('video'), videoController.convertMp4ToMp3);

module.exports = router;
