const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('ffmpeg-static');

// Configurar fluent-ffmpeg usando la ruta del ffmpeg-static instalado
ffmpeg.setFfmpegPath(ffmpegInstaller);

function processVideo(inputPath, outputPath, action, quality, startSecs, duration) {
    return new Promise((resolve, reject) => {
        let command = ffmpeg(inputPath);

        // Apply trimming if parameters are valid
        if (startSecs !== null && duration !== null) {
            command = command.setStartTime(startSecs).setDuration(duration);
        }

        if (action === 'extract-audio') {
            command = command
                .noVideo() // -vn
                .audioCodec('libmp3lame')
                .audioBitrate('192k');
        } else if (action === 'compress-video') {
            // Apply compression and resizing
            command = command.videoCodec('libx264');
            
            if (quality === '1080p') {
                command = command.size('?x1080').videoBitrate('2500k');
            } else if (quality === '720p') {
                command = command.size('?x720').videoBitrate('1500k');
            } else if (quality === '480p') {
                command = command.size('?x480').videoBitrate('800k');
            } else {
                command = command.size('?x720').videoBitrate('1500k'); // Default Medium
            }
        } else {
            return reject(new Error('Invalid video action'));
        }

        command
            .output(outputPath)
            .on('end', () => {
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error(`ffmpeg error: ${err.message}`);
                reject(new Error(`FFmpeg falló: ${err.message}`));
            })
            .run();
    });
}

module.exports = {
    processVideo,
};
