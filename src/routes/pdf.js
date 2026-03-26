const express = require('express');
const router = express.Router();
const pdfController = require('../controllers/pdfController');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage: storage });

router.post('/compress', upload.single('pdf'), pdfController.compressPdf);
router.post('/merge', upload.array('pdf', 50), pdfController.mergePdfs);
router.post('/split', upload.single('pdf'), pdfController.splitPdf);
router.post('/sign', upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'signature', maxCount: 1 }]), pdfController.signPdf);

module.exports = router;
