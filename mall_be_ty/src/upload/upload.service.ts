import { Injectable } from '@nestjs/common';
import { FileService } from './file.service';
import { uuid } from 'uuidv4';

@Injectable()
export class UploadService {
  constructor(private readonly fileService:FileService){}

  async addAvatar(imageBuffer: Buffer, filename:string){
    return await this.fileService.uploadProfile(imageBuffer, filename)
  }

  async getPresignedUrl(filename:string){
    return await this.fileService.getSignedUrlCloudfront(filename)
  }

  async addBrandImage(imageBuffer: Buffer, filename:string){
    return await this.fileService.uploadBrand(imageBuffer, filename)
  }

  async deleteBrandImage(filename:string){
    return await this.fileService.deleteBrandImage(filename)
  }

  async addProductImage(imageBuffer: Buffer, filename:string){
    return this.fileService.uploadProductPicture(imageBuffer, filename)
  }

  async addProductImages(files: Array<Express.Multer.File>){
    const fileUploadResults = []
    for(const file of files){
        const filename = `${uuid()}-${file.originalname}`
        const uploadFileResponse = await this.addProductImage(file.buffer, filename)
        fileUploadResults.push({...uploadFileResponse, success: true})
    }
    return fileUploadResults
    // return this.fileService.uploadProfile(imageBuffer, filename)
  }
}
