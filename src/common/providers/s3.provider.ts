import * as AWS from 'aws-sdk';
import { Injectable } from '@nestjs/common';

@Injectable()
export class S3Provicer {
  public getS3(): AWS.S3 {
    return new AWS.S3({
      accessKeyId: process.env.LIARA_FILE_ACCESS_KEY,
      secretAccessKey: process.env.LIARA_FILE_SECRET_KEY,
      endpoint: process.env.LIARA_FILE_ENDPOINT,
      s3ForcePathStyle: true,
    });
  }

  public getFileStream(key: string, bucket: string, range?: string) {
    const downloadParams = {
      Key: key,
      Bucket: bucket,
      Range: range,
    };
    return this.getS3().getObject(downloadParams).createReadStream();
  }
  public sizeOf(key: string, bucket: string) {
    return this.getS3()
      .headObject({ Key: key, Bucket: bucket })
      .promise()
      .then((res) => res.ContentLength);
  }
}
