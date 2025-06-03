import { Injectable } from '@nestjs/common';
import { FileService } from './file.service';
import { v4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(private readonly fileService:FileService){}

  async addBanner(imageBuffer: Buffer, filename:string){
    return await this.fileService.uploadBanner(imageBuffer, filename)
  }

  async addAvatar(imageBuffer: Buffer, filename:string){
    return await this.fileService.uploadProfile(imageBuffer, filename)
  }

  async getPresignedUrl(filename:string){
    return await this.fileService.getSignedUrlCloudfront(filename)
  }

  async addBrandImage(imageBuffer: Buffer, filename:string){
    return await this.fileService.uploadBrand(imageBuffer, filename)
  }

  async addCategoryImage(imageBuffer: Buffer, filename:string){
    return await this.fileService.uploadCategory(imageBuffer, filename)
  }

  async addStoreImage(imageBuffer: Buffer, filename:string){
    return await this.fileService.uploadStore(imageBuffer, filename)
  }

  async deleteBrandImage(filename:string){
    return await this.fileService.deleteBrandImage(filename)
  }

  async deleteStoreImage(filename:string){
    return await this.fileService.deleteStoreImage(filename)
  }

  async deleteCategoryImage(filename:string){
    return await this.fileService.deleteCategoryImage(filename)
  }

  async addProductImage(imageBuffer: Buffer, filename:string){
    return this.fileService.uploadProductPicture(imageBuffer, filename)
  }

  async addProductImages(files: Array<Express.Multer.File>){
    const fileUploadResults = []
    for(const file of files){
        const filename = `${v4()}-${file.originalname}`
        const uploadFileResponse = await this.addProductImage(file.buffer, filename)
        fileUploadResults.push({...uploadFileResponse, success: true})
    }
    return fileUploadResults
    // return this.fileService.uploadProfile(imageBuffer, filename)
  }
}
