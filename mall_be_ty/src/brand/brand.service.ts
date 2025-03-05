import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepo:Repository<Brand>,
    @InjectRepository(Category) private readonly categoryRepo:Repository<Category>,
  ){}

  async create(createBrandDto: CreateBrandDto) {
    try{
      const brandEntity = this.brandRepo.create()
      const saveEntity = {
        ...brandEntity,
        name: createBrandDto.name.toLowerCase(),
      }
      console.log(createBrandDto);
      

      const brand = await this.brandRepo.save(saveEntity)
      if(createBrandDto.category){
        const category = await this.categoryRepo.findOne({
          where: {
            name: createBrandDto.category.toLowerCase()
          }, relations: {brands: true}
        })

        category.brands = [...category.brands, brand]
        await this.categoryRepo.save(category)
      }
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

  findOneByNameAndCategory(name: string, category: string) {
    return this.brandRepo.findOne({
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
