import { Injectable } from '@nestjs/common';
import {S3} from 'aws-sdk'
import { uuid } from 'uuidv4';

@Injectable()
export class FileService {
    constructor(){}
    async uploadFile(imageBuffer: Buffer, filename:string){
        const s3 = new S3()
        return await s3.upload({
            Bucket: process.env.BUCKET_NAME,
            Body: imageBuffer,
            Key: `${uuid}-${filename}`
        }).promise()
    }

    async deleteFile(key:string){
        const s3 = new S3()
        return await s3.deleteObject({
            Bucket: process.env.BUCKET_NAME,
            Key: key
        }).promise()
    }


}
