const imageMagickService = require('../services/imageMagickService');
const rembgService = require('../services/rembgService');
const path = require('path');
const fs = require('fs');

exports.resizeAndConvertImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ninguna imagen.' });
    }

    const { width, format } = req.body;
    const inputPath = req.file.path;
    const originalName = path.parse(req.file.originalname).name;
    const outputFileName = `${originalName}-${Date.now()}.${format || 'jpg'}`;
    const outputPath = path.join('uploads', outputFileName);

    try {
        await imageMagickService.processImage({
            inputPath,
            outputPath,
            width: width ? parseInt(width, 10) : null,
            format: format
        });

        // Servir el archivo para descarga y luego limpiarlo
        res.download(outputPath, path.basename(outputPath), (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
            }
            // Limpiar archivos
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error en el procesado de imagen:', error);
        fs.unlinkSync(inputPath);
        res.status(500).json({ error: 'El procesado de imagen ha fallado.', details: error.message });
    }
};

exports.removeBg = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ninguna imagen.' });
    }

    const inputPath = req.file.path;

    try {
        const { outputPath, outputFileName } = await rembgService.removeBackground(inputPath);

        res.download(outputPath, outputFileName, (err) => {
            if (err) console.error('Error al enviar el archivo:', err);
            // Limpieza
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error al quitar el fondo:', error);
        fs.unlinkSync(inputPath);
        res.status(500).json({ error: 'No se pudo quitar el fondo.', details: error.message });
    }
};
