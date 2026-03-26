const ffmpegService = require('../services/ffmpegService');
const path = require('path');
const fs = require('fs');

exports.processVideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo de vídeo.' });
    }

    const { action, quality, startTime, endTime } = req.body;
    const inputPath = req.file.path;
    const originalName = path.parse(req.file.originalname).name;
    
    const isAudioExtraction = action === 'extract-audio';
    const ext = isAudioExtraction ? '.mp3' : '.mp4';
    
    const outputPath = path.join('uploads', `${originalName}-${Date.now()}${ext}`);

    // Compute duration if startTime & endTime exist
    const st = parseFloat(startTime);
    const et = parseFloat(endTime);
    let startSecs = null;
    let duration = null;

    if (!isNaN(st) && !isNaN(et) && et > st) {
        startSecs = st;
        duration = et - st;
    }

    try {
        await ffmpegService.processVideo(inputPath, outputPath, action, quality, startSecs, duration);
        
        res.download(outputPath, path.basename(outputPath), (err) => {
            if (err) console.error('Error al enviar el archivo:', err);
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error en la conversión de vídeo:', error);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        res.status(500).json({ error: 'El procesado del vídeo ha fallado.', details: error.message });
    }
};
