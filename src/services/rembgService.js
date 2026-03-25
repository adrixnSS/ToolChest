const { exec } = require('child_process');
const path = require('path');

function removeBackground(inputPath) {
    return new Promise((resolve, reject) => {
        const outputDir = path.dirname(inputPath);
        const originalName = path.parse(path.basename(inputPath)).name;
        // Rembg guarda el archivo con un sufijo, necesitamos encontrarlo
        const expectedOutputName = `${originalName}.out.png`;
        const outputPath = path.join(outputDir, expectedOutputName);

        // Usamos la ruta completa al ejecutable dentro del venv
        const command = `~/entorno_ia/bin/rembg i "${inputPath}" "${outputPath}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`rembg error: ${error.message}`);
                return reject(new Error(`rembg falló: ${stderr || error.message}`));
            }
            if (stderr) {
                // rembg usa stderr para logs de progreso, no siempre son errores
                console.log(`rembg stderr: ${stderr}`);
            }
            console.log(`rembg stdout: ${stdout}`);
            resolve({ outputPath: outputPath, outputFileName: expectedOutputName });
        });
    });
}

module.exports = {
    removeBackground,
};
