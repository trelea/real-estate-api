import { S3Client, PutBucketCorsCommand } from '@aws-sdk/client-s3';
import { config } from 'dotenv';
config();
// Configure the S3 client
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS!, // Recommended to use environment variables
    secretAccessKey: process.env.AWS_S3_SECRET!,
  },
});

const bucketName = process.env.AWS_S3_BUCKET;

// Configure CORS to allow all domains
async function setCorsPolicy() {
  try {
    const command = new PutBucketCorsCommand({
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'], // Chrome often requires OPTIONS
            AllowedOrigins: ['https://admin.dialogimobil.md'],
            ExposeHeaders: ['ETag'],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    });

    const response = await s3Client.send(command);
    console.log('CORS policy updated successfully:', response);
    return response;
  } catch (err) {
    console.error('Error setting CORS policy:', err);
    throw err;
  }
}

// Execute the function
setCorsPolicy();
