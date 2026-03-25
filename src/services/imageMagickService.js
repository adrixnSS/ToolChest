const { exec } = require('child_process');

function processImage({ inputPath, outputPath, width, format }) {
    return new Promise((resolve, reject) => {
        let resizeOption = width ? `-resize ${width}` : '';
        
        // El comando 'convert' es parte de ImageMagick
        const command = `convert "${inputPath}" ${resizeOption} "${outputPath}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`ImageMagick error: ${error.message}`);
                return reject(new Error(`ImageMagick falló: ${stderr || error.message}`));
            }
            if (stderr) {
                console.log(`ImageMagick stderr: ${stderr}`);
            }
            resolve(outputPath);
        });
    });
}

module.exports = {
    processImage,
};
