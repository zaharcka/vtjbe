import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';

export async function extractAudioToMonoMp3(
  inputPath: string,
  outputDir: string,
  deleteOriginal = false,
): Promise<string> {
  const outputFileName = `${path.parse(inputPath).name}.mp3`;
  const outputPath = path.join(outputDir, outputFileName);

  return new Promise<string>((resolve, reject) => {
    ffmpeg(inputPath)
      .noVideo()
      .audioChannels(1) // Конвертируем в моно
      .audioBitrate('128k')
      .format('mp3')
      .on('end', () => {
        if (deleteOriginal) {
          fs.unlinkSync(inputPath);
        }
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(new Error(`FFmpeg error: ${err.message}`));
      })
      .save(outputPath);
  });
}
