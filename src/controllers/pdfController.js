const ghostscriptService = require('../services/ghostscriptService');
const path = require('path');
const fs = require('fs');

exports.compressPdf = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo PDF.' });
    }

    const inputPath = req.file.path;
    const originalName = path.parse(req.file.originalname).name;
    const outputFileName = `${originalName}-compressed-${Date.now()}.pdf`;
    const outputPath = path.join('uploads', outputFileName);

    try {
        await ghostscriptService.compressPdf(inputPath, outputPath);

        res.download(outputPath, outputFileName, (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
            }
            // Limpiar archivos
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error en la compresión de PDF:', error);
        fs.unlinkSync(inputPath);
        res.status(500).json({ error: 'La compresión de PDF ha fallado.', details: error.message });
    }
};
