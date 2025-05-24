import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';
import { GenerateSlug } from 'src/helpers/common';
import { SubCategory } from 'src/category/entities/subcategory.entity';
import { UploadService } from 'src/upload/upload.service';
import { v4 } from 'uuid';
import { BrandReponse } from './dto/response.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepo:Repository<Brand>,
    @InjectRepository(Category) private readonly categoryRepo:Repository<Category>,
    private readonly uploadService: UploadService
  ){}

  async create(createBrandDto: CreateBrandDto) {
    try{
      const brandEntity = this.brandRepo.create()
      const saveEntity = {
        ...brandEntity,
        name: createBrandDto.name.toLowerCase(),
        brandId: v4(),
        categories: createBrandDto.category.map(category => {
          const cat = new Category()
          cat.name = category.toLowerCase()
          cat.slug = GenerateSlug(category.toLowerCase())
          return cat
        }),
        subCategories: createBrandDto.subCategory.map(subCategory => {
          const sub = new SubCategory()
          sub.name = subCategory.toLowerCase()
          sub.slug = GenerateSlug(subCategory.toLowerCase())

          return sub
        })
      }
      const brand = await this.brandRepo.save(saveEntity)
      
      return brand
    }catch(err){
      throw err
    }
  }

  findAll() {
    return this.brandRepo.find({
      relations: {
        categories: true
      }
    })
  }

  findOne(id: number) {
    return this.brandRepo.findOne({
      where: {id},
      relations: {
        categories: true,
        products: true
      }
    });
  }

  findOneByName(name: string) {
    return this.brandRepo.findOne({
      where: {name},
      relations: {
        categories: true,
        products: true
      }
    });
  }

  findOneByCategory(category: string) {
    return this.brandRepo.findOne({
      relations: {
        categories: true,
        products: true
      },
      where: {categories: {
        name: category.toLowerCase()
      }},
    });
  }

  findByCategory(category: string) {
    return this.brandRepo.find({
      relations: {
        categories: true,
        products: true
      },
      where: {categories: {
        name: category.toLowerCase()
      }},
    });
  }

  async findOneByNameAndCategory(name: string, category: string) {
    const brand = await this.brandRepo.findOne({
      relations: {
        categories: true,
        products: true
      },
      where: {
        name,
        categories: {
        name: category.toLowerCase()
      }},
    });

    const brandResponse = new BrandReponse(brand)
    if (brandResponse.imageName) {
      brandResponse.imageUrl = await this.uploadService.getPresignedUrl(
        `brands/${brandResponse.imageName}`
      );
    }
  }

  findByCategories(category: string[]) {
    return this.brandRepo.find({
      relations: {
        categories: true,
        products: true
      },
      where: {categories: In([...category])},
    });
  }

  updateBrandImage(id:number, filename:string){
    return this.brandRepo.update(id, {
      url: filename
    })
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return this.brandRepo.update(id, {
      name: updateBrandDto.name
    });
  }

  remove(id: number) {
    return this.brandRepo.delete(id);
  }
}
