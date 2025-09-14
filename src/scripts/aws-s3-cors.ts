import { config } from 'dotenv';
import {
  S3Client,
  PutBucketCorsCommand,
  PutBucketPolicyCommand,
  PutPublicAccessBlockCommand,
  GetBucketCorsCommand,
} from '@aws-sdk/client-s3';

config();
const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION || 'eu-north-1',
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS as string,
    secretAccessKey: process.env.AWS_S3_SECRET as string,
  },
});

async function fixS3Cors() {
  const bucketName = process.env.AWS_S3_BUCKET || 'dialogimobilbucket';

  console.log(`🔧 Fixing CORS for bucket: ${bucketName}\n`);

  try {
    // Step 1: Remove public access blocks first
    console.log('1️⃣ Removing public access blocks...');
    await s3Client.send(
      new PutPublicAccessBlockCommand({
        Bucket: bucketName,
        PublicAccessBlockConfiguration: {
          BlockPublicAcls: false,
          IgnorePublicAcls: false,
          BlockPublicPolicy: false,
          RestrictPublicBuckets: false,
        },
      }),
    );
    console.log('✅ Public access blocks removed\n');

    // Step 2: Set CORS configuration - FIX: Use wildcard or full URLs with protocol
    console.log('2️⃣ Setting CORS configuration...');
    const corsConfig = {
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'HEAD'],
            AllowedOrigins: ['*'],
            ExposeHeaders: [],
            MaxAgeSeconds: 3000,
          },
        ],
      },
    };

    await s3Client.send(new PutBucketCorsCommand(corsConfig));
    console.log('✅ CORS configuration set\n');

    // Step 3: Set bucket policy for public read
    console.log('3️⃣ Setting public read policy...');
    const bucketPolicy = {
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'PublicReadGetObject',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject', // Changed from array to string
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    };

    await s3Client.send(
      new PutBucketPolicyCommand({
        Bucket: bucketName,
        Policy: JSON.stringify(bucketPolicy),
      }),
    );
    console.log('✅ Public read policy set\n');

    // Step 4: Verify CORS configuration
    console.log('4️⃣ Verifying CORS configuration...');
    const getCorsCommand = new GetBucketCorsCommand({ Bucket: bucketName });
    const corsResponse = await s3Client.send(getCorsCommand);
    console.log('✅ Current CORS Rules:');
    console.log(JSON.stringify(corsResponse.CORSRules, null, 2));

    console.log('\n✨ SUCCESS! Your S3 bucket is now configured.');
    console.log('📌 Images should be accessible from any domain now.');
    console.log('\n⚠️  IMPORTANT:');
    console.log('1. Wait 2-5 minutes for changes to propagate');
    console.log('2. Clear your browser cache completely');
    console.log('3. Try incognito/private mode');
    console.log('4. If still not working, restart your dev server');
  } catch (error: any) {
    console.error('❌ Error:', error.message);

    if (error.Code === 'AccessDenied') {
      console.error(
        '\n⚠️  Access Denied - Your AWS credentials may not have sufficient permissions.',
      );
      console.error(
        '   You need s3:PutBucketCors, s3:PutBucketPolicy, and s3:PutPublicAccessBlock permissions.',
      );
    }

    if (error.Code === 'NoSuchBucket') {
      console.error('\n⚠️  Bucket not found. Please check the bucket name.');
    }
  }
}

// Check environment variables
if (!process.env.AWS_S3_ACCESS || !process.env.AWS_S3_SECRET) {
  console.error('❌ Missing AWS credentials in .env file!');
  console.error('Please ensure your .env file contains:');
  console.error('AWS_S3_ACCESS=your_access_key');
  console.error('AWS_S3_SECRET=your_secret_key');
  console.error('AWS_S3_REGION=eu-north-1');
  console.error('AWS_S3_BUCKET=dialogimobilbucket');
  process.exit(1);
}

fixS3Cors();
