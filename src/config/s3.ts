import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

const s3Config: S3ClientConfig = {
  endpoint: 'https://s3.ru1.storage.beget.cloud', // или явный URL "https://your-s3-endpoint.com"
  region: 'us-east-1',
  forcePathStyle: true, // Важно для не-AWS S3 (MinIO и др.)
  credentials: {
    accessKeyId: '3D4B7FREI2HSVC1G7FOI',
    secretAccessKey: 'YVD54YJJhHFnajfIzuzxFRD8zCvSD5NnRhkGaeSZ',
  },
};

export const s3 = new S3Client(s3Config);

module.exports = { s3 };
