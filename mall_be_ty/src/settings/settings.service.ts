import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { BannerResponseDto } from './dto/response.dto';
import { UploadService } from 'src/upload/upload.service';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Banner) private readonly bannerRepo:Repository<Banner>,
    private readonly uploadService: UploadService,
  ){}

  addBannerImage(filename:string) {
    const bannerEntity = this.bannerRepo.create()
    const saveEntity = {
      ...bannerEntity,
      imageName: filename,
      bannerId: v4()
    } 

    return this.bannerRepo.save(saveEntity)
  }

  async findAllBanners() {
    const banners = await this.bannerRepo.find()
    const bannersResponse = banners.map(banner=>new BannerResponseDto(banner))

    bannersResponse.map(async (banner)=>{
      banner.imageUrl = await this.uploadService.getPresignedUrl(`banners/${banner.imageName}`)
    })

    return bannersResponse
  }

  async deleteBanner(bannerId: string){
    try{

      const banner = await this.bannerRepo.findOne({
        where: {
          bannerId
        }
      })
      
      if(!banner) throw new BadRequestException()
      
      return await this.bannerRepo.delete(bannerId)
    }catch(err){
    }
  }
}

