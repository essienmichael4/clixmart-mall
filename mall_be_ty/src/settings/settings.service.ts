import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Banner } from './entities/banner.entity';
import { DataSource, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { BannerResponseDto } from './dto/response.dto';
import { UploadService } from 'src/upload/upload.service';
import { Tax } from './entities/tax.entity';
import { TaxDto } from './dto/Tax.dto';
import { UserInfo } from 'src/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { CommissionService } from 'src/commission/commission.service';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Banner) private readonly bannerRepo:Repository<Banner>,
    @InjectRepository(Tax) private readonly taxRepo:Repository<Tax>,
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    private readonly uploadService: UploadService,
    private readonly commissionService: CommissionService,
    private readonly dataSource:DataSource
  ){}

  async createTax(tax: TaxDto, userId: number){
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try{
      const taxEntity = this.taxRepo.create()
      const saveEntity = {
        ...taxEntity,
        taxId: v4(),
        taxPercent: tax.taxPercent
      } 
      
      const createdTax = await this.taxRepo.save(saveEntity)
      await this.commissionService.aduitLog('CREATE_TAX', {
        taxPercent: tax.taxPercent,
        status: "SUCCESSFUL"
      }, userId);

      await queryRunner.commitTransaction();
      return createdTax
    }catch(err){
      await queryRunner.rollbackTransaction()

      await this.commissionService.auditLogError('TAX_CREATION_FAILED', err, userId, {
        taxPercent: undefined,
        status: "FAILED"
      });

      throw err
    }finally{
      await queryRunner.release()
    }
  }

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

  async findTax(){
    return await this.taxRepo.findOne({
      where: {},
      order: {id: "DESC"}
    })
  }

  async updateTax(id: number, tax: TaxDto, userId: number){
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    const prevTax = await this.taxRepo.findOne({where: {id}})

    try{
      const updatedTax = await this.taxRepo.update(id, {
        taxPercent: tax.taxPercent
      })

      await this.commissionService.aduitLog('UPDATE_TAX', {
        previousTaxPercent: prevTax.taxPercent,
        taxPercent: tax.taxPercent,
        status: "SUCCESSFUL"
      }, userId);

      await queryRunner.commitTransaction();
      return updatedTax
    }catch(err){
      await queryRunner.rollbackTransaction()

      await this.commissionService.auditLogError('TAX_UPDATE_FAILED', err, userId, {
        previousTaxPercent: prevTax.taxPercent,
        taxPercent: tax.taxPercent,
        status: "FAILED"
      });

      throw err
    }finally{
      await queryRunner.release()
    }
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
