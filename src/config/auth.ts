// src/config/auth.ts
export const JWT_SECRET = process.env.JWT_SECRET;
export const TOKEN_EXPIRES_IN = '1h';
export const PRICING = {
  download: 10, // 10 условных единиц за скачивание
  conversion: 20, // 20 за конвертацию
  recognition: 30, // 30 за распознавание
};
