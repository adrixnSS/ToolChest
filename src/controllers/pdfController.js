const pdfService = require('../services/pdfService');
const path = require('path');
const fs = require('fs');

exports.compressPdf = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo PDF.' });
    }

    const inputPath = req.file.path;
    const { title, author, subject, keywords, creator, producer, creationDate, modDate } = req.body;
    const originalName = path.parse(req.file.originalname).name;
    const outputFileName = `${originalName}-updated-${Date.now()}.pdf`;
    const outputPath = path.join('uploads', outputFileName);

    console.log(`[PDF] Recibido para procesar: ${inputPath} -> ${outputPath}`);

    try {
        await pdfService.compressPdf(inputPath, outputPath, title, author, subject, keywords, creator, producer, creationDate, modDate);

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

exports.mergePdfs = async (req, res) => {
    if (!req.files || req.files.length < 2) {
        return res.status(400).json({ error: 'Se necesitan al menos 2 PDFs para fusionar.' });
    }
    
    const inputPaths = req.files.map(f => f.path);
    const outputFileName = `Merged-Toolchest-${Date.now()}.pdf`;
    const outputPath = path.join('uploads', outputFileName);

    try {
        await pdfService.mergePdfs(inputPaths, outputPath);

        res.download(outputPath, outputFileName, (err) => {
            if (err) console.error('Error al enviar archivo fusionado:', err);
            inputPaths.forEach(p => { if(fs.existsSync(p)) fs.unlinkSync(p) });
            if(fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error fusionando PDFs:', error);
        inputPaths.forEach(p => { if(fs.existsSync(p)) fs.unlinkSync(p) });
        res.status(500).json({ error: 'Fallo al fusionar los documentos.', details: error.message });
    }
};

exports.splitPdf = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No se ha subido archivo para dividir.' });
    if (!req.body.pages) return res.status(400).json({ error: 'Rango de páginas necesario.' });

    const inputPath = req.file.path;
    const outputFileName = `Split-${Date.now()}.pdf`;
    const outputPath = path.join('uploads', outputFileName);

    try {
        await pdfService.splitPdf(inputPath, outputPath, req.body.pages);
        
        res.download(outputPath, outputFileName, (err) => {
            if (err) console.error('Error al enviar archivo dividido:', err);
            if(fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if(fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error dividiendo PDF:', error);
        if(fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        res.status(500).json({ error: 'Fallo al dividir el documento.', details: error.message });
    }
};

exports.signPdf = async (req, res) => {
    if (!req.files || !req.files.pdf || !req.files.signature) {
        return res.status(400).json({ error: 'Faltan archivos para realizar la firma.' });
    }

    const pdfFile = req.files.pdf[0];
    const sigFile = req.files.signature[0];
    const inputPath = pdfFile.path;
    const sigPath = sigFile.path;
    const { title, author } = req.body;
    
    const outputFileName = `Signed-${Date.now()}.pdf`;
    const outputPath = path.join('uploads', outputFileName);

    try {
        await pdfService.signPdf(inputPath, sigPath, outputPath, title, author);

        res.download(outputPath, outputFileName, (err) => {
            if (err) console.error('Error al enviar archivo firmado:', err);
            if(fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
            if(fs.existsSync(sigPath)) fs.unlinkSync(sigPath);
            if(fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
        });

    } catch (error) {
        console.error('Error firmando PDF:', error);
        if(fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if(fs.existsSync(sigPath)) fs.unlinkSync(sigPath);
        res.status(500).json({ error: 'Fallo al firmar el documento.', details: error.message });
    }
};
