const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function compressPdf(inputPath, outputPath, title, author, subject, keywords, creator, producer) {
    try {
        // Leemos el PDF a memoria
        const currentPdfBytes = fs.readFileSync(inputPath);
        
        // Cargamos el documento. Ignoramos streams corruptos
        const pdfDoc = await PDFDocument.load(currentPdfBytes, { ignoreEncryption: true });
        
        if (title && title.trim().length > 0) pdfDoc.setTitle(title.trim());
        if (author && author.trim().length > 0) pdfDoc.setAuthor(author.trim());
        if (subject && subject.trim().length > 0) pdfDoc.setSubject(subject.trim());
        
        if (keywords && keywords.trim().length > 0) {
            // pdf-lib setKeywords acepta un array de strings
            pdfDoc.setKeywords(keywords.split(',').map(k => k.trim()));
        }

        if (creator && creator.trim().length > 0) pdfDoc.setCreator(creator.trim());
        if (producer && producer.trim().length > 0) pdfDoc.setProducer(producer.trim());
        
        // Guardamos el documento con compresión de objetos nativa de pdf-lib (useObjectStreams)
        const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });
        
        fs.writeFileSync(outputPath, compressedPdfBytes);
        return outputPath;
    } catch (error) {
        console.error(`pdf-lib error: ${error.message}`);
        throw new Error(`Fallo guardando el PDF nativamente: ${error.message}`);
    }
}

module.exports = {
    compressPdf,
};
