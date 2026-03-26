const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function compressPdf(inputPath, outputPath, title, author, subject, keywords, creator, producer, creationDate, modDate) {
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
        
        if (creationDate) {
            const d = new Date(creationDate);
            if (!isNaN(d.getTime())) pdfDoc.setCreationDate(d);
        }

        if (modDate) {
            const d = new Date(modDate);
            if (!isNaN(d.getTime())) pdfDoc.setModificationDate(d);
        }
        
        // Guardamos el documento con compresión de objetos nativa de pdf-lib (useObjectStreams)
        const compressedPdfBytes = await pdfDoc.save({ useObjectStreams: true });
        
        fs.writeFileSync(outputPath, compressedPdfBytes);
        return outputPath;
    } catch (error) {
        console.error(`pdf-lib error: ${error.message}`);
        throw new Error(`Fallo guardando el PDF nativamente: ${error.message}`);
    }
}

async function mergePdfs(inputPaths, outputPath) {
    try {
        const mergedPdf = await PDFDocument.create();
        for (const inputPath of inputPaths) {
            if (!fs.existsSync(inputPath)) continue;
            const pdfBytes = fs.readFileSync(inputPath);
            const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        const mergedBytes = await mergedPdf.save({ useObjectStreams: true });
        fs.writeFileSync(outputPath, mergedBytes);
        return outputPath;
    } catch (error) {
        throw new Error(`Fallo fusionando PDFs: ${error.message}`);
    }
}

function parsePageRange(rangeStr, maxPages) {
    const pages = new Set();
    const parts = rangeStr.split(',');
    for (const part of parts) {
        if (part.includes('-')) {
            const [start, end] = part.split('-').map(p => parseInt(p.trim(), 10));
            if (!isNaN(start) && !isNaN(end)) {
                for (let i = start; i <= end; i++) {
                    if (i > 0 && i <= maxPages) pages.add(i - 1);
                }
            }
        } else {
            const pageNum = parseInt(part.trim(), 10);
            if (!isNaN(pageNum) && pageNum > 0 && pageNum <= maxPages) {
                pages.add(pageNum - 1);
            }
        }
    }
    return Array.from(pages).sort((a, b) => a - b);
}

async function splitPdf(inputPath, outputPath, pagesRangeStr) {
    try {
        const sourceBytes = fs.readFileSync(inputPath);
        const sourcePdf = await PDFDocument.load(sourceBytes, { ignoreEncryption: true });
        
        const totalPages = sourcePdf.getPageCount();
        const pageIndices = parsePageRange(pagesRangeStr, totalPages);
        
        if (pageIndices.length === 0) throw new Error("Format error or no valid pages match the range.");

        const splittedPdf = await PDFDocument.create();
        const copiedPages = await splittedPdf.copyPages(sourcePdf, pageIndices);
        copiedPages.forEach((page) => splittedPdf.addPage(page));
        
        const pdfBytes = await splittedPdf.save({ useObjectStreams: true });
        fs.writeFileSync(outputPath, pdfBytes);
        return outputPath;
    } catch (error) {
        throw new Error(`Fallo dividiendo PDF: ${error.message}`);
    }
}

async function signPdf(inputPath, sigPath, outputPath, title, author) {
    try {
        const pdfBytes = fs.readFileSync(inputPath);
        const sigBytes = fs.readFileSync(sigPath);
        const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
        
        // Importar la imagen de la firma (PNG)
        const sigImage = await pdfDoc.embedPng(sigBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        
        // Dibujar la firma sobre la primera página
        // En el frontend, el canvas de dibujo coincide con el tamaño del renderizado (viewport 1.5)
        // pdf-lib usa puntos, así que escalamos la imagen para que encaje proporcionalmente
        const { width, height } = firstPage.getSize();
        
        // La firma se dibuja ocupando todo el área (el canvas de firma era transparente y del mismo tamaño que la página)
        firstPage.drawImage(sigImage, {
            x: 0,
            y: 0,
            width: width,
            height: height,
        });

        if (title) pdfDoc.setTitle(title);
        if (author) pdfDoc.setAuthor(author);

        const signedBytes = await pdfDoc.save({ useObjectStreams: true });
        fs.writeFileSync(outputPath, signedBytes);
        return outputPath;
    } catch (error) {
        throw new Error(`Fallo firmando PDF: ${error.message}`);
    }
}

module.exports = {
    compressPdf,
    mergePdfs,
    splitPdf,
    signPdf
};
