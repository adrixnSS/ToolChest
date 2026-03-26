const ffmpegService = require('../services/ffmpegService');
const path = require('path');
const fs = require('fs');

exports.processVideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo de vídeo.' });
    }

    const { action, quality, startTime, endTime, format } = req.body;
    const inputPath = req.file.path;
    const originalName = path.parse(req.file.originalname).name;
    
    // Determine extension: if extract-audio then mp3, if convert/compress use selected format or mp4
    let ext = '.mp4';
    if (action === 'extract-audio') ext = '.mp3';
    else if (format) ext = `.${format.toLowerCase()}`;
    
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
        
        // Ensure the file exists before sending
        if (!fs.existsSync(outputPath)) throw new Error('FFmpeg failed to create output file.');

        res.download(outputPath, path.basename(outputPath), (err) => {
            if (err) console.error('Error al enviar el archivo:', err);
            if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error en la conversión de vídeo:', error);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        res.status(500).json({ error: 'El procesado del vídeo ha fallado.', details: error.message });
    }
};
