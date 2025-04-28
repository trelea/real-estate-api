import { PutObjectCommandOutput } from '@aws-sdk/client-s3';

export type AwsS3UploadFileResponseType = {
  object: PutObjectCommandOutput;
  url: string;
};
