const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\\s+/g, '-')}`)
});
const upload = multer({ storage: storage });

router.post('/process', upload.single('video'), videoController.processVideo);

module.exports = router;
