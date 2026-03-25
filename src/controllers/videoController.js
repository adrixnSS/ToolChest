const ffmpegService = require('../services/ffmpegService');
const path = require('path');
const fs = require('fs');

exports.convertMp4ToMp3 = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
    }

    const inputPath = req.file.path;
    const originalName = path.parse(req.file.originalname).name;
    const outputPath = path.join('uploads', `${originalName}-${Date.now()}.mp3`);

    try {
        await ffmpegService.convertToMp3(inputPath, outputPath);
        
        // Servir el archivo para descarga y luego limpiarlo
        res.download(outputPath, path.basename(outputPath), (err) => {
            if (err) {
                console.error('Error al enviar el archivo:', err);
            }
            // Limpiar archivos subidos y convertidos
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error en la conversión:', error);
        // Limpiar archivo subido si la conversión falla
        fs.unlinkSync(inputPath);
        res.status(500).json({ error: 'La conversión ha fallado.', details: error.message });
    }
};
