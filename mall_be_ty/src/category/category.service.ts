import { HttpException, Injectable } from '@nestjs/common';
import { CreateCategoryDto, EditCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { SubCategory } from './entities/subcategory.entity';
import { CreateSubCategoryDto, CreateSubLevelSubCategoryDto, EditSubCategoryDto } from './dto/create-sub-category.dto';
import { v4 } from 'uuid';
import { CategoryResponseDto } from './dto/categoryResponse.dto';
import { UploadService } from 'src/upload/upload.service';
import { SecondLevelSubCategory } from './entities/secondLevelSubCategory.entity';
import { ThirdLevelSubCategory } from './entities/thirdLevelSubcategory.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepo:Repository<Category>,
    @InjectRepository(SubCategory) private readonly subCategoryRepo:Repository<SubCategory>,
    @InjectRepository(SecondLevelSubCategory) private readonly secondLevelSubCategoryRepo:Repository<SecondLevelSubCategory>,
    @InjectRepository(ThirdLevelSubCategory) private readonly thirdLevelSubCategoryRepo:Repository<ThirdLevelSubCategory>,
    private readonly uploadService:UploadService,
  ){}

  create(createCategoryDto: CreateCategoryDto) {
    const categoryEntity =  this.categoryRepo.create()
    const saveEntity = {
      ...categoryEntity,
      name: createCategoryDto.name.toLowerCase(),
      categoryId: v4(),
      slug: this.generateSlug(createCategoryDto.name.toLowerCase())
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
        subCategoryId: v4(),
        slug: this.generateSlug(createSubCategoryDto.name.toLowerCase()),
        category
      }

      return this.subCategoryRepo.save(saveEntity)
    }catch(err){
      throw err
    }
  }

  async createSecondLevelSubCategory(createSubLevelSubCategoryDto: CreateSubLevelSubCategoryDto) {
    try{      
      const subCategory = await this.subCategoryRepo.findOneBy({name: createSubLevelSubCategoryDto.subCategory.toLowerCase()})
      
      if(!subCategory) throw new HttpException("Sub Category does not exist", 400)

      const secondLevelSubCategoryEntity =  this.secondLevelSubCategoryRepo.create()
      const saveEntity = {
        ...secondLevelSubCategoryEntity,
        name: createSubLevelSubCategoryDto.name.toLowerCase(),
        secondLevelSubCategoryId: v4(),
        slug: this.generateSlug(createSubLevelSubCategoryDto.name.toLowerCase()),
        subCategory
      }

      return await this.secondLevelSubCategoryRepo.save(saveEntity)
    }catch(err){
      throw err
    }
  }

  async createThirdLevelSubCategory(createSubLevelSubCategoryDto: CreateSubLevelSubCategoryDto) {
    try{      
      const secondLevelSubCategory = await this.secondLevelSubCategoryRepo.findOneBy({name: createSubLevelSubCategoryDto.subCategory.toLowerCase()})
      
      if(!secondLevelSubCategory) throw new HttpException("Sub Category does not exist", 400)

      const thirdLevelSubCategoryEntity =  this.thirdLevelSubCategoryRepo.create()
      const saveEntity = {
        ...thirdLevelSubCategoryEntity,
        name: createSubLevelSubCategoryDto.name.toLowerCase(),
        subCategoryId: v4(),
        slug: this.generateSlug(createSubLevelSubCategoryDto.name.toLowerCase()),
        secondLevelSubCategory
      }

      return this.thirdLevelSubCategoryRepo.save(saveEntity)
    }catch(err){
      throw err
    }
  }

  async findAllCategories() {
    const categories = await this.categoryRepo.find({
      relations: {
        subCategories: {
          secondLevelSubCategories:{
            thirdLevelSubCategories: true
          }
        },
        
      }
    });
    
    const categoriesResponse = await Promise.all(
      categories.map(async (category) => {
        const categoryResponse = new CategoryResponseDto(category);
    
        if (categoryResponse.imageName) {
          categoryResponse.imageUrl = await this.uploadService.getPresignedUrl(
            `category/${categoryResponse.imageName}`
          );
        }
    
        return categoryResponse;
      })
    );

    return categoriesResponse
  }

  findAllSubCategories() {
    return this.subCategoryRepo.find({
      relations: {
        secondLevelSubCategories: {
          thirdLevelSubCategories: true
        }
      }
    });
  }

  findAllSecondLevelSubCategories() {
    return this.secondLevelSubCategoryRepo.find({
      relations: {
        thirdLevelSubCategories: true
      }
    });
  }

  async findCategorySubCategories(category:string) {
    const subCategories = await this.subCategoryRepo.find({
      relations: {
        category: true,
        secondLevelSubCategories: {
          thirdLevelSubCategories: true
        }
      },
      where: {
        category: {
          name: category
        }
      }
    });

    return subCategories
  }

  async findSubCategorySecond(subCategory:string) {
    const secondLevelSubCategories = await this.secondLevelSubCategoryRepo.find({
      relations: {
        subCategory: true,
        thirdLevelSubCategories: true
      },
      where: {
        subCategory: {
          name: subCategory
        }
      }
    });

    return secondLevelSubCategories
  }

  async findSubCategoryThird(secondLevelSubCategory:string) {
    const secondLevelSubCategories = await this.thirdLevelSubCategoryRepo.find({
      relations: {
        secondLevelSubCategory: true
      },
      where: {
        secondLevelSubCategory: {
          name: secondLevelSubCategory
        }
      }
    });

    return secondLevelSubCategories
  }

  async findOneById(id: number) {
    const category = await this.categoryRepo.findOne({
      where:{id}
    });

    return category
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOne({
      where:{id},
      relations: {
        subCategories: {
          secondLevelSubCategories: {
            thirdLevelSubCategories: true
          }
        }
      }
    });
    const categoryResponse = new CategoryResponseDto(category)
    if (categoryResponse.imageName) {
      categoryResponse.imageUrl = await this.uploadService.getPresignedUrl(
        `category/${categoryResponse.imageName}`
      );
    }

    return categoryResponse
  }

  updateCategory(id: number, editCategoryDto: EditCategoryDto) {
    return this.categoryRepo.update(id, {
      name: editCategoryDto.name
    })
  }

  updateSubCategory(id: number, editSubCategoryDto: EditSubCategoryDto) {
    return this.subCategoryRepo.update(id,{
      name: editSubCategoryDto.name
    })
  }

  updateCategoryImage(id:number, filename:string){
    return this.categoryRepo.update(id, {
      imageName: filename
    })
  }

  removeCategory(id: number) {
    return this.categoryRepo.delete(id)
  }

  removeSubCategory(id: number) {
    return this.subCategoryRepo.delete(id);
  }

  
  generateSlug(name:string): string {
    const spilt = name.split(" ").join("-") 
    const removeOpenParenthesis = spilt.replaceAll("(", "")
    const removecloseParenthesis = removeOpenParenthesis.replaceAll(")", "")
    const removeOpenBrackets = removecloseParenthesis.replaceAll("[", "")
    const removecloseBrackets = removeOpenBrackets.replaceAll("]", "")
    const removecommas = removeOpenBrackets.replaceAll(",", "")

    return removecloseBrackets
  }
}
