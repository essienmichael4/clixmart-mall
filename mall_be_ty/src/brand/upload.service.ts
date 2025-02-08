import { Injectable } from '@nestjs/common';
import { FileService } from './file.service';

@Injectable()
export class UploadService {
  constructor(private readonly fileService:FileService){}

  async addAvatar(imageBuffer: Buffer, filename:string){
    return this.fileService.uploadFile(imageBuffer, filename)
  }
}
