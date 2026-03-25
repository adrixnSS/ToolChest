const { exec } = require('child_process');

function convertToMp3(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        // -i: input file
        // -vn: no video
        // -acodec: libmp3lame: audio codec
        // -ab: 192k: audio bitrate
        const command = `ffmpeg -i "${inputPath}" -vn -acodec libmp3lame -ab 192k "${outputPath}"`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`ffmpeg error: ${error.message}`);
                return reject(new Error(`FFmpeg falló: ${stderr || error.message}`));
            }
            if (stderr) {
                console.log(`ffmpeg stderr: ${stderr}`);
            }
            console.log(`ffmpeg stdout: ${stdout}`);
            resolve(outputPath);
        });
    });
}

module.exports = {
    convertToMp3,
};
