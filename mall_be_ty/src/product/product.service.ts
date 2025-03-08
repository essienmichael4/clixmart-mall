import { Injectable } from '@nestjs/common';
import { CreateProductDto, ProductDetailsDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateProductReviewStatusDto, UpdateProductStatusDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Store } from 'src/store/entities/store.entity';
import { Inventory, Product, Status } from './entities/product.entity';
import { ProductReview, ReviewStatus } from './entities/review.entity';
import { User } from 'src/user/entities/user.entity';
import { Category } from 'src/category/entities/category.entity';
import { SubCategory } from 'src/category/entities/subcategory.entity';
import { Brand } from 'src/brand/entities/brand.entity';
import { ProductImage } from './entities/productImage.entity';
import { Tag } from './entities/tag.entity';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { v4 } from 'uuid';
import { ProductReponseDto } from './dto/response.dto';
import { FileService } from 'src/upload/file.service';
import { UploadService } from 'src/upload/upload.service';

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
    private readonly uploadService: UploadService
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
        status: ReviewStatus.PENDING
      })

      const productEntity = this.productRepo.create()
      const saveEntity = {
        ...productEntity,
        name: createProductDto.name.toLowerCase(),
        slug: this.generateSlug(createProductDto.name.toLowerCase()),
        productReview: productReview,
        productId: v4(),
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
      const tags = productDetails.tags.map(tag=>{
        const tagEntity = this.tagRepo.create()
        const saveEntity = {
          ...tagEntity,
          name: tag.toLowerCase(),
          tagId: v4(),
        }
        return saveEntity
      })

      product.category = category
      product.subCategory = subCategory
      product.brand = brand
      product.model = productDetails.model
      product.description = productDetails.description
      product.price = productDetails.price
      product.quantity = productDetails.quantity
      product.discount = productDetails.discount || 0
      product.tags = tags

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

  async findProducts(pageOptionsDto:PageOptionsDto, q?: string, category?: string, subCategory?: string){
    const products = await this.productRepo.find({
      relations:{
        productReview: true,
        category: true,
        subCategory: true,
        brand:true,
        productImages:true
      },
      where: {
        ...(q && { name: Like(`%${q.toLowerCase()}%`) }),
        inventory: Inventory.INSTOCK,
        status: Status.PUBLISH,
        productReview: {
          status: ReviewStatus.APPROVED
        },
        category: {
          ...(category && { name: category.toLowerCase() }),
        },
        subCategory: {
          ...(subCategory && { name: subCategory.toLowerCase() }),
        }
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take
    })

    const productsResponse = products.map(product=> new ProductReponseDto(product))

    productsResponse.map(async (product) => {
      product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

      product.productImages.map(async (image) => {
        image.imageUlr = await this.uploadService.getPresignedUrl(`products/${image.url}`)
        return image
      })
    })

    const productsCount = await this.productRepo.count()
    const pageMetaDto = new PageMetaDto({itemCount: productsCount, pageOptionsDto})
    return new PageDto(productsResponse, pageMetaDto)
  }

  async findProductsByCategory(pageOptionsDto:PageOptionsDto, q?: string, category?: string, subCategory?: string){
    const products = await this.productRepo.find({
      relations:{
        productReview: true,
        category: true,
        subCategory: true,
        brand:true
      },
      where: {
        ...(q && { name: Like(`%${q.toLowerCase()}%`) }),
        inventory: Inventory.INSTOCK,
        status: Status.PUBLISH,
        productReview: {
          status: ReviewStatus.APPROVED
        },
        category: {
          ...(category && { name: category.toLowerCase() }),
        },
        subCategory: {
          ...(subCategory && { name: subCategory.toLowerCase() }),
        }
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take
    })

    const productsResponse = products.map(product=> new ProductReponseDto(product))

    productsResponse.map(async (product) => {
      product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

      product.productImages.map(async (image) => {
        image.imageUlr = await this.uploadService.getPresignedUrl(`products/${image.url}`)
        return image
      })
    })

    const productsCount = await this.productRepo.count()
    const pageMetaDto = new PageMetaDto({itemCount: productsCount, pageOptionsDto})
    return new PageDto(products, pageMetaDto)
  }

  async findAll() {
    const products = await this.productRepo.find({
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

    const productsResponse = products.map(product=> new ProductReponseDto(product))

    productsResponse.map(async (product) => {
      product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

      product.productImages.map(async (image) => {
        image.imageUlr = await this.uploadService.getPresignedUrl(`products/${image.url}`)
        return image
      })
    })

    return productsResponse
  }

  async findOne(id: number) {
    const product = await this.productRepo.findOne({
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

    const productResponse = new ProductReponseDto(product)

    productResponse.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

    productResponse.productImages.map(async (image) => {
      image.imageUlr = await this.uploadService.getPresignedUrl(`products/${image.url}`)
      return image
    })

    return productResponse
  }

  async findCartProducts(products:number[]){
    const cartProducts = await this.productRepo.find({
      where: {
        id: In(products)
      }
    })

    const productsResponse = cartProducts.map(product=> new ProductReponseDto(product))

    productsResponse.map(async (product) => {
      product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

      product.productImages.map(async (image) => {
        image.imageUlr = await this.uploadService.getPresignedUrl(`products/${image.url}`)
        return image
      })
    })

    return productsResponse
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
    
    const productResponse = new ProductReponseDto(product)

    productResponse.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

    productResponse.productImages.map(async (image) => {
      image.imageUlr = await this.uploadService.getPresignedUrl(`products/${image.url}`)
      return image
    })

    return productResponse
  }

  async findStoreProducts(store: string){
    const products =  await this.productRepo.find({
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

    const productsResponse = products.map(product=> new ProductReponseDto(product))

    productsResponse.map(async (product) => {
      product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

      product.productImages.map(async (image) => {
        image.imageUlr = await this.uploadService.getPresignedUrl(`products/${image.url}`)
        return image
      })
    })

    return productsResponse
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  updateStatus(id: number, updateProductStatusDto: UpdateProductStatusDto) {
    return this.productRepo.update(id, {
      status: updateProductStatusDto.status
    })
  }

  async updateReviewStatus(id: number, updateProductReviewStatusDto: UpdateProductReviewStatusDto) {
    const product = await this.productRepo.findOne({
      where: {id},
      relations: {
        productReview: true
      }
    })
    product.productReview.status = updateProductReviewStatusDto.status
    await this.productRepo.save(product)
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
