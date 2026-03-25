const { exec } = require('child_process');

function compressPdf(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        // Opciones de compresión para Ghostscript
        // /screen, /ebook, /printer, /prepress, /default
        const compressionLevel = '/ebook'; 

        const command = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dNOPAUSE -dBATCH -sProcessColorModel=DeviceRGB -dColorImageResolution=150 -dGrayImageResolution=150 -dMonoImageResolution=150 -dDetectDuplicateImages=true -dCompressFonts=true -dSubsetFonts=true -dEmbedAllFonts=true -sOutputFile="${outputPath}" "${compressionLevel}" "${inputPath}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Ghostscript error: ${error.message}`);
                return reject(new Error(`Ghostscript falló: ${stderr || error.message}`));
            }
            if (stderr) {
                console.log(`Ghostscript stderr: ${stderr}`);
            }
            resolve(outputPath);
        });
    });
}

module.exports = {
    compressPdf,
};
