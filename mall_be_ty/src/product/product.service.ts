import { Injectable } from '@nestjs/common';
import { CreateProductDto, ProductDetailsDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from 'src/store/entities/store.entity';
import { Product } from './entities/product.entity';
import { ProductReview, Status } from './entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { SubCategory } from 'src/category/entities/subcategory.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { ProductImage } from './entities/productImage.entity';
import { Tag } from './entities/tag.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Store) private readonly storeRepo:Repository<Store>,
    @InjectRepository(Product) private readonly productRepo:Repository<Product>,
    @InjectRepository(ProductReview) private readonly productReviewRepo:Repository<ProductReview>,
    @InjectRepository(ProductImage) private readonly productImageRepo:Repository<ProductImage>,
    @InjectRepository(Tag) private readonly tagRepo:Repository<Tag>,
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(Category) private readonly categoryRepo:Repository<Category>,
    @InjectRepository(SubCategory) private readonly subCategoryRepo:Repository<SubCategory>,
    @InjectRepository(Brand) private readonly brandRepo:Repository<Brand>,
  ){}

  async create(storeName: string, userId: number, createProductDto: CreateProductDto) {
    try{
      const user = await this.userRepo.findOne({where: {
          id:userId
        }, relations: {
          products: true
        }
      })
      const store = await this.storeRepo.findOne({
        where :{slug: storeName}
      })
      const productReview = await this.productReviewRepo.save({
        status: Status.PENDING
      })

      const productEntity = this.productRepo.create()
      const saveEntity = {
        ...productEntity,
        name: createProductDto.name.toLowerCase(),
        slug: this.generateSlug(createProductDto.name.toLowerCase()),
        productReview: productReview,
        store
      }

      const product = await this.productRepo.save(saveEntity)
      user.products = [...user.products, product]
      await this.userRepo.save(user)
      return product
    }catch(err){
      throw err
    }
  }

  async productDetails(store:string, productId:number, productDetails:ProductDetailsDto){
    try{
      const product = await this.productRepo.findOne({
        relations: {
          store: true
        },
        where:{
          id:productId,
          store: {
            slug: store
          }
        }
      })
      const category = await this.categoryRepo.findOneBy({name: productDetails.category.toLowerCase()})
      const subCategory = await this.subCategoryRepo.findOneBy({name: productDetails.subCategory.toLowerCase()})
      const brand = await this.brandRepo.findOneBy({name: productDetails.brand.toLowerCase()})
      const tags = await this.tagRepo.upsert(productDetails.tags.map(tag=>{
        return {
          name: tag
        }
      }), ["name"])
      console.log(tags);
      console.log(productDetails.description);
      
      
      product.category = category
      product.subCategory = subCategory
      product.brand = brand
      product.model = productDetails.model
      product.description = productDetails.description
      product.price = productDetails.price
      product.quantity = productDetails.quantity
      product.discount = productDetails.discount || 0
      // product.tags = tags

      return await this.productRepo.save(product)
    }catch(err){
      throw err
    }
  }

  async addOtherProductImages(id:number, filenames: string[]){
    const product = await this.productRepo.findOne({
      where: {id},
      relations:{
        productImages: true
      }
    });

    const productImagesEntities = filenames.map(filename=>{
      const productEntity = this.productImageRepo.create()
      return  {
        ...productEntity,
        url: filename,
        product: product
      }
    })

    return this.productImageRepo.insert(productImagesEntities)
  }

  findAll() {
    return this.productRepo.find({
      relations: {
        store: true,
        productImages: true,
        productReview: true,
        tags: true,
        brand: true,
        category: true,
        subCategory: true,
        user: true
      },
    });
  }

  findOne(id: number) {
    return this.productRepo.findOne({
      where: {id},
      relations: {
        store: true,
        productImages: true,
        productReview: true,
        tags: true,
        brand: true,
        category: true,
        subCategory: true,
        user: true
      },
    });
  }

  async findStoreProduct(store: string, productId: number){
    const product =  await this.productRepo.findOne({
      relations: {
        store: true,
        productImages: true,
        productReview: true,
        tags: true,
        brand: true,
        category: true,
        subCategory: true,
        user: true
      },
      where: {
        id: productId,
        store: {
          slug: store
        }
      }
    })
    
    return product
  }

  async findStoreProducts(store: string){
    const product =  await this.productRepo.find({
      relations: {
        store: true,
        productImages: true,
        productReview: true,
        tags: true,
        brand: true,
        category: true,
        subCategory: true,
        user: true
      },
      where: {
        store: {
          slug: store
        }
      }
    })

    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  updateProductImage(id: number, filename:string) {
    return this.productRepo.update(id, {
      imageName: filename
    });
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  generateSlug(name:string): string {
    const spilt = name.split(" ").join("-") 
    const removeOpenParenthesis = spilt.replaceAll("(", "")
    const removecloseParenthesis = removeOpenParenthesis.replaceAll(")", "")
    const removeOpenBrackets = removecloseParenthesis.replaceAll("[", "")
    const removecloseBrackets = removeOpenBrackets.replaceAll("]", "")

    return removecloseBrackets
  }
}
