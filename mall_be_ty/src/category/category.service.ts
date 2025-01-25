import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { SubCategory } from './entities/subcategory.entity';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepo:Repository<Category>,
    @InjectRepository(SubCategory) private readonly subCategoryRepo:Repository<SubCategory>,
  ){}

  create(createCategoryDto: CreateCategoryDto) {
    const categoryEntity =  this.categoryRepo.create()
    const saveEntity = {
      ...categoryEntity,
      name: createCategoryDto.name.toLowerCase()
    }
    try{
      return this.categoryRepo.save(saveEntity)
    }catch(err){
      throw err
    }
  }

  async createSubCategory(createSubCategoryDto: CreateSubCategoryDto) {
    try{      
      const category = await this.categoryRepo.findOneBy({name: createSubCategoryDto.category.toLowerCase()})
      
      if(!category) throw new HttpException("Category does not exist", 400)

      const subCategoryEntity =  this.subCategoryRepo.create()
      const saveEntity = {
        ...subCategoryEntity,
        name: createSubCategoryDto.name.toLowerCase(),
        category
      }

      return this.subCategoryRepo.save(saveEntity)
    }catch(err){
      throw err
    }
  }

  async findAllCategories() {
    const categories = await this.categoryRepo.find({
      relations:["subCategories"]
    });

    console.log(categories);
    return categories
    
  }

  findAllSubCategories() {
    return this.categoryRepo.find();
  }

  findOne(id: number) {
    return this.categoryRepo.findOneBy({id});
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
