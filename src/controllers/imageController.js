const sharp = require('sharp');
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
        let pipeline = sharp(inputPath);
        if (width && parseInt(width, 10) > 0) {
            pipeline = pipeline.resize(parseInt(width, 10));
        }
        
        if (format) {
            pipeline = pipeline.toFormat(format.toLowerCase());
        }

        await pipeline.toFile(outputPath);

        res.download(outputPath, path.basename(outputPath), (err) => {
            if (err) console.error('Error al enviar el archivo:', err);
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error en el procesado de imagen:', error);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        res.status(500).json({ error: 'El procesado de imagen ha fallado.', details: error.message });
    }
};

exports.removeBg = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ninguna imagen.' });
    }

    const inputPath = req.file.path;
    const originalName = path.parse(req.file.originalname).name;
    const outputFileName = `${originalName}-cropped-${Date.now()}.png`;
    const outputPath = path.join('uploads', outputFileName);

    try {
        // La imagen ya viene con el fondo transparente desde el canvas del frontend.
        // Solo la optimizamos con sharp.
        await sharp(inputPath)
            .png({ quality: 90, compressionLevel: 9 })
            .toFile(outputPath);

        res.download(outputPath, outputFileName, (err) => {
            if (err) console.error('Error al enviar el archivo:', err);
            fs.unlinkSync(inputPath);
            fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error al optimizar imagen borrada:', error);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        res.status(500).json({ error: 'No se pudo procesar la imagen.', details: error.message });
    }
};
