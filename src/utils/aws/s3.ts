import { S3, AWSError } from 'aws-sdk';
import * as fs from 'fs';
import Config from './config';

export const putObject = (localpath: string, bucketPath: string): Promise<S3.PutObjectOutput> => new Promise((resolve, reject) => {
  const s3 = new S3();

  const params: S3.PutObjectRequest = {
    Bucket: Config.Bucket,
    Key: bucketPath,
  };

  params.Body = fs.readFileSync(localpath);

  s3.putObject(params, (error: AWSError, data: S3.PutObjectOutput) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(data);
  });
});

export const getObject = (filepath: string): Promise<S3.PutObjectOutput> => new Promise((resolve, reject) => {
  const s3 = new S3();

  const params: S3.GetObjectRequest = {
    Bucket: Config.Bucket,
    Key: filepath,
  };

  s3.getObject(params, (error: AWSError, data: S3.GetObjectOutput) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(data);
  });
});

// max 1000
export const dirList = (bucketPath: string): Promise<S3.ListObjectsOutput> => new Promise((resolve, reject) => {
  const s3 = new S3();

  const params: S3.ListObjectsRequest = {
    Bucket: Config.Bucket,
  };

  s3.listObjects(params, (error: AWSError, data: S3.ListObjectsOutput) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(data);
  });
});
