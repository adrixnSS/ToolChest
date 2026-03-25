const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage: storage });

router.post('/resize-convert', upload.single('image'), imageController.resizeAndConvertImage);
router.post('/remove-background', upload.single('image'), imageController.removeBg);

module.exports = router;
