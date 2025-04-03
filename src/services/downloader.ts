import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { updateOrder } from './orders';
import {extractAudioToMonoMp3} from "./audioEncoder";

const downloadsDir = path.join(__dirname, '../../downloads');
if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true });
}

async function downloadVideoFile(videoUrl: string): Promise<string> {
    const response = await axios.get(videoUrl, {
        responseType: 'stream',
        timeout: 100000
    });

    const videoFileName = videoUrl.split('/').pop() || `video_${Date.now()}.mp4`;
    const videoPath = path.join(downloadsDir, videoFileName);

    const writer = fs.createWriteStream(videoPath);
    response.data.pipe(writer);

    return new Promise<string>((resolve, reject) => {
        writer.on('finish', () => resolve(videoPath));
        writer.on('error', (error) => reject(error));
    });
}

// 2. Главная функция обработки
export async function processVideo(orderId: string, videoUrl: string): Promise<void> {
    try {
        // Шаг 1: Загрузка видео
        const videoPath = await downloadVideoFile(videoUrl);

        // Шаг 2: Конвертация в аудио
        const audioPath = await extractAudioToMonoMp3(videoPath, downloadsDir, true);

        // Шаг 3: Обновление статуса
        updateOrder(orderId, {
            status: 'converted',
            filePath: audioPath,
            originalVideoUrl: videoUrl
        });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        updateOrder(orderId, {
            status: 'failed',
            error: errorMessage
        });
    }
}
