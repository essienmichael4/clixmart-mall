import { Injectable } from '@nestjs/common';
import { CreateProductDto, ProductDetailsDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateProductReviewStatusDto, UpdateProductStatusDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Like, QueryRunner, Repository } from 'typeorm';
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
import { ProductResponseDto } from './dto/response.dto';
import { UploadService } from 'src/upload/upload.service';
import { MonthHistory } from './entities/MonthHistory.entity';
import { UserMonthHistory } from './entities/UserMonthHistory.entity';
import { UserYearHistory } from './entities/UserYearHistory.entity';
import { YearHistory } from './entities/YearHistory.entity';
import { GetDay, GetMonth, GetYear } from 'src/helpers/common';
import { ProductFilterDto } from './dto/request.dto';
import { ProductOption } from './entities/productOption.entity';
import { ProductOptionValue } from './entities/productOptionValue.entity';
import { ProductSpecification } from './entities/productSpecification.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Store) private readonly storeRepo:Repository<Store>,
    @InjectRepository(Product) private readonly productRepo:Repository<Product>,
    @InjectRepository(ProductReview) private readonly productReviewRepo:Repository<ProductReview>,
    @InjectRepository(ProductOption) private readonly productOptionRepo:Repository<ProductOption>,
    @InjectRepository(ProductOptionValue) private readonly productOptionValueRepo:Repository<ProductOptionValue>,
    @InjectRepository(ProductSpecification) private readonly productSpecificationRepo:Repository<ProductSpecification>,
    @InjectRepository(ProductImage) private readonly productImageRepo:Repository<ProductImage>,
    @InjectRepository(Tag) private readonly tagRepo:Repository<Tag>,
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(Category) private readonly categoryRepo:Repository<Category>,
    @InjectRepository(SubCategory) private readonly subCategoryRepo:Repository<SubCategory>,
    @InjectRepository(Brand) private readonly brandRepo:Repository<Brand>,
    @InjectRepository(MonthHistory) private readonly monthHistoryRepo:Repository<MonthHistory>,
    @InjectRepository(YearHistory) private readonly yearHistoryRepo:Repository<YearHistory>,
    @InjectRepository(UserMonthHistory) private readonly userMonthHistoryRepo:Repository<UserMonthHistory>,
    @InjectRepository(UserYearHistory) private readonly userYearHistoryRepo:Repository<UserYearHistory>,
    private readonly uploadService: UploadService,
    private readonly dataSource:DataSource
  ){}

  async create(storeName: string, userId: number, createProductDto: CreateProductDto) {
    const queryRunner = this.dataSource.createQueryRunner()

    const user = await this.userRepo.findOne({where: {
        id:userId
      }
    })
    const store = await this.storeRepo.findOne({
      where :{slug: storeName}
    })

    try{
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const productReviewEntity = this.productReviewRepo.create({
        status: ReviewStatus.PENDING,
        reviewId: v4()
      })
      const productReview = await this.createProductReview(productReviewEntity, queryRunner)

      const productEntity = this.productRepo.create()
      const saveEntity = {
        ...productEntity,
        name: createProductDto.name,
        searchName: createProductDto.name.toLowerCase(),
        slug: this.generateSlug(createProductDto.name.toLowerCase()),
        productReview: productReview,
        productId: v4(),
        store,
        user
      }

      const product = await this.createProduct(saveEntity, queryRunner)
      await this.upsertMonthHistoryProducts(queryRunner)
      await this.upsertYearHistoryProducts(queryRunner)
      await this.upsertUserYearHistoryProducts(user.id, queryRunner)
      await this.upsertUserMonthHistoryProducts(user.id, queryRunner)
      
      await queryRunner.commitTransaction()

      return product
    }catch(err){
      await queryRunner.rollbackTransaction()
      throw err
    }finally{
      await queryRunner.release()
    }
  }

  async createProduct(payload:Product, queryRunner: QueryRunner){
    return await queryRunner.manager.save(Product, {
      ...payload
    })
  }

  async createProductReview(payload:ProductReview, queryRunner: QueryRunner){
    return await queryRunner.manager.save(ProductReview, {
      ...payload
    })
  }

  async productDetails(store:string, productId:string, productDetails:ProductDetailsDto){
    try{
      const {name} = productDetails
      const product = await this.productRepo.findOne({
        relations: {
          store: true
        },
        where:{
          productId,
          store: {
            slug: store
          }
        }
      })

      const category = await this.categoryRepo.findOneBy({name: productDetails.category.toLowerCase()})
      const subCategory = await this.subCategoryRepo.findOneBy({name: productDetails.subCategory.toLowerCase()})
      const brand = await this.brandRepo.findOneBy({name: productDetails.brand.toLowerCase()})
      // ✅ Resolve or create tags
      const newTags = [];
      for (const tag of productDetails.tags) {
        const existing = await this.tagRepo.findOneBy({ name: tag.toLowerCase() });
        if (existing) {
          newTags.push(existing);
        } else {
          const newTag = this.tagRepo.create({
            tagId: v4(),
            name: tag.toLowerCase()
          });
          const savedTag = await this.tagRepo.save(newTag);
          newTags.push(savedTag);
        }
      }

      // ✅ Rebuild options
      const incomingOptions = [];

      if (productDetails.colors?.length) {
        incomingOptions.push({ name: "Colors", values: productDetails.colors });
      }

      if (productDetails.sizes?.length) {
        incomingOptions.push({ name: "Sizes", values: productDetails.sizes });
      }

      if (productDetails.properties?.length) {
        incomingOptions.push(...productDetails.properties); // These already have { name, values } format
      }

      // ✅ Merge with existing options
      const updatedOptions = [];

      for (const opt of incomingOptions) {
        // create new option
        const newOption = this.productOptionRepo.create({
          name: opt.name,
          product: product,
          values: opt.values.map((v: string) =>
            this.productOptionValueRepo.create({ value: v })
          )
        });
        updatedOptions.push(newOption);
      }

      if(name){
        product.name = name
        product.searchName = name.toLowerCase()
      }

      if (productDetails.specifications?.length) {
        product.specifications = productDetails.specifications.map(spec => {
          const specEntity = this.productSpecificationRepo.create(); // or new ProductSpecification()
          return {
            ...specEntity,
            name: spec.name,
            value: spec.value,
            product: product  // link back to parent if needed
          };
        });
      }

      product.category = category
      product.subCategory = subCategory
      product.brand = brand
      product.model = productDetails.model
      product.description = productDetails.description
      product.price = productDetails.price
      product.quantity = productDetails.quantity
      product.discount = productDetails.discount || 0
      product.tags = newTags
      product.options = updatedOptions

      return await this.productRepo.save(product)
    }catch(err){
      throw err
    }
  }

  async addOtherProductImages(productId:string, filenames: string[]){
    const product = await this.productRepo.findOne({
      where: {productId},
      relations:{
        productImages: true
      }
    });

    const productImagesEntities = filenames.map(filename=>{
      const productEntity = this.productImageRepo.create()
      return  {
        ...productEntity,
        url: filename,
        product: product,
        productImageId: v4()
      }
    })

    return await this.productImageRepo.insert(productImagesEntities)
  }

  async findProducts(pageOptionsDto:PageOptionsDto, q?: string, category?: string, subCategory?: string){
    const products = await this.productRepo.find({
      relations:{
        productReview: true,
        category: true,
        subCategory: true,
        brand:true,
        productImages:true,
        options: {
          values: true
        },
        specifications: true
      },
      where: {
        ...(q && { name: Like(`%${q.toLowerCase()}%`) }),
        inventory: Inventory.INSTOCK,
        status: Status.PUBLISH,
        productReview: {
          status: ReviewStatus.APPROVED
        },
        category: {
          ...(category && { slug: category.toLowerCase() }),
        },
        subCategory: {
          ...(subCategory && { slug: subCategory.toLowerCase() }),
        }
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take
    })

    const productsResponse = products.map(product=> new ProductResponseDto(product))

    productsResponse.map(async (product) => {
      if(product.imageName){
        product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)
      }

      product.productImages.map(async (image) => {
        image.imageUrl = await this.uploadService.getPresignedUrl(`products/${image.url}`)
        return image
      })
    })

    const productsCount = await this.productRepo.count()
    const pageMetaDto = new PageMetaDto({itemCount: productsCount, pageOptionsDto})
    return new PageDto(productsResponse, pageMetaDto)
  }

  async findProductsByCategory(pageOptionsDto:PageOptionsDto, category?: string){
    const products = await this.productRepo.find({
      relations:{
        productReview: true,
        category: true,
        subCategory: true,
        brand:true,
        productImages: true,
        specifications: true,
        options: {
          values: true
        }
      },
      where: {
        inventory: Inventory.INSTOCK,
        status: Status.PUBLISH,
        productReview: {
          status: ReviewStatus.APPROVED
        },
        category: {
          ...(category && { slug: category.toLowerCase() }),
        }
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take
    })

    const productsResponse = products.map(product=> new ProductResponseDto(product))

    productsResponse.map(async (product) => {
      if(product.imageName){
        product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)
      }

      if(product.productImages?.length > 0) {
        product.productImages.map(async (image) => {
            image.imageUrl = await this.uploadService.getPresignedUrl(`products/${image.url}`)
          return image
        })
      }
    })
    
    const productsCount = await this.productRepo.count()
    const pageMetaDto = new PageMetaDto({itemCount: productsCount, pageOptionsDto})
    return new PageDto(productsResponse, pageMetaDto)
  }

  async findProductsByCategoryAndSubCategories(pageOptionsDto:PageOptionsDto, category?: string, subCategories?: string[], secondLevelSub?:string[], thirdLevelSub?:string[]){
    const products = await this.productRepo.find({
      relations:{
        options: {
          values: true
        },
        specifications: true,
        productReview: true,
        category: true,
        subCategory: {
          secondLevelSubCategories: {
            // thirdLevelSubCategories: true
          }
        },
        brand:true
      },
      where: {
        inventory: Inventory.INSTOCK,
        status: Status.PUBLISH,
        productReview: {
          status: ReviewStatus.APPROVED
        },
        category: {
          ...(category && { slug: category.toLowerCase() }),
        },
        ...(subCategories.length > 0 && {
          subCategory: {
            subCategoryId: In(subCategories),
            ...(secondLevelSub.length > 0 && {
              secondLevelSubCategories: {secondLevelSubCategoryId: In(secondLevelSub)},
              ...(thirdLevelSub.length > 0 && {
                thirdLevelSubCategories: {
                  thirdLevelSubCategoryId: In(thirdLevelSub)
              }
              })
            })
          }
        })
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take
    })

    const productsResponse = products.map(product=> new ProductResponseDto(product))

    productsResponse.map(async (product) => {
      product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

      if(product.productImages?.length > 0) {
        product.productImages.map(async (image) => {
            image.imageUrl = await this.uploadService.getPresignedUrl(`products/${image.url}`)
          return image
        })
      }
    })
    
    const productsCount = await this.productRepo.count()
    const pageMetaDto = new PageMetaDto({itemCount: productsCount, pageOptionsDto})
    return new PageDto(productsResponse, pageMetaDto)
  }

  async findAll() {
    const products = await this.productRepo.find({
      relations: {
        options: {
          values: true
        },
        specifications: true,
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

    const productsResponse = products.map(product=> new ProductResponseDto(product))

    productsResponse.map(async (product) => {
      product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

      if(product.productImages.length > 0) {
        product.productImages.map(async (image) => {
          image.imageUrl = await this.uploadService.getPresignedUrl(`products/${image.url}`)
          return image
        })
      }
    })

    return productsResponse
  }

  async findAllByStatusOrReviewStatus(productFilterDto:ProductFilterDto) {
    const {status, review} = productFilterDto
    const products = await this.productRepo.find({
      relations: {
        options: {
          values: true
        },
        specifications: true,
        store: true,
        productImages: true,
        productReview: true,
        tags: true,
        brand: true,
        category: true,
        subCategory: true,
        user: true
      },where: {
        ...(status && { status:  status}),
        productReview: {
          ...(review && {status: review})
        }
      }
    });

    const productsResponse = products.map(product=> new ProductResponseDto(product))

    productsResponse.map(async (product) => {
      product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

      if(product.productImages.length > 0) {
        product.productImages.map(async (image) => {
          image.imageUrl = await this.uploadService.getPresignedUrl(`products/${image.url}`)
          return image
        })
      }
    })

    return productsResponse
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({
      where: {productId: id},
      relations: {
        options: {
          values: true
        },
        specifications: true,
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

    const productResponse = new ProductResponseDto(product)

    if(productResponse.imageName){
      productResponse.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)
    }

    if(productResponse.productImages) {
      productResponse.productImages.map(async (image) => {
        image.imageUrl = await this.uploadService.getPresignedUrl(`products/${image.url}`)
        return image
      })
    }

    return productResponse
  }

  async findProductByProductId(productId: string) {
    const product = await this.productRepo.findOne({
      where: {productId},
      relations: {
        store: true,
        productImages: true,
        productReview: true,
        tags: true,
        brand: true,
        category: true,
        subCategory: true,
        user: true,
        options: {
          values: true
        },
        specifications: true,
      },
    });

    const productResponse = new ProductResponseDto(product)

    if(productResponse.imageName){
      productResponse.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)
    }

    if(productResponse.productImages) {
      productResponse.productImages.map(async (image) => {
        image.imageUrl = await this.uploadService.getPresignedUrl(`products/${image.url}`)
        return image
      })
    }

    return productResponse
  }

  async findCartProducts(products:string[]){
    const cartProducts = await this.productRepo.find({
      where: {
        productId: In(products)
      }
    })

    const productsResponse = cartProducts.map(product=> new ProductResponseDto(product))

    productsResponse.map(async (product) => {
      product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

      product?.productImages?.map(async (image) => {
        image.imageUrl = await this.uploadService.getPresignedUrl(`products/${image.url}`)
        return image
      })
    })

    return productsResponse
  }

  async findStoreProduct(store: string, productId: string){
    const product =  await this.productRepo.findOne({
      relations: {
        store: true,
        productImages: true,
        productReview: true,
        tags: true,
        brand: true,
        category: true,
        subCategory: true,
        user: true,
        specifications: true,
        options: {
          values: true
        }
      },
      where: {
        productId: productId,
        store: {
          slug: store
        }
      }
    })
    
    const productResponse = new ProductResponseDto(product)

    productResponse.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

    productResponse.productImages.map(async (image) => {
      image.imageUrl = await this.uploadService.getPresignedUrl(`products/${image.url}`)
      return image
    })

    return productResponse
  }

  async findStoreProducts(store: string, productFilterDto:ProductFilterDto){
    const {status, review} = productFilterDto
    const products =  await this.productRepo.find({
      relations: {
        store: true,
        productImages: true,
        productReview: true,
        tags: true,
        brand: true,
        category: true,
        subCategory: true,
        user: true,
        specifications: true,
        options: {
          values: true
        }
      },
      where: {
        ...(status && { status:  status}),
        productReview: {
          ...(review && {status: review})
        }, store: {
          slug: store
        }
      }
    })

    const productsResponse = products.map(product=> new ProductResponseDto(product))

    productsResponse.map(async (product) => {
      product.imageUrl = await this.uploadService.getPresignedUrl(`products/${product.imageName}`)

      product.productImages.map(async (image) => {
        image.imageUrl = await this.uploadService.getPresignedUrl(`products/${image.url}`)
        return image
      })
    })

    return productsResponse
  }

  update(productId: string, updateProductDto: UpdateProductDto) {
    const {name, price, quantity, discount, model, description} = updateProductDto
    return this.productRepo.update(productId, {
      ...(name && { name: name }),
      ...(name && { searchName: name.toLowerCase() }),
      ...(price && { price: price }),
      ...(quantity && { quantity: quantity }),
      ...(discount && { discount: discount }),
      ...(model && { model: model }),
      ...(description && { description: description }),
    });
  }

  async updateProductDetails(store:string, productId:string, productDetails:ProductDetailsDto){
    try{
      const product = await this.productRepo.findOne({
        relations: {
          store: true,
          // tags: true
        },
        where:{
          productId,
          store: {
            slug: store
          }
        }
      })

      if (!product) throw new Error("Product not found");

      const category = await this.categoryRepo.findOneBy({name: productDetails.category.toLowerCase()})
      const subCategory = await this.subCategoryRepo.findOneBy({name: productDetails.subCategory.toLowerCase()})
      const brand = await this.brandRepo.findOneBy({name: productDetails.brand.toLowerCase()})
      
      const newtags = await Promise.all(
        productDetails.tags.map(async (tag) => {
          const lowerTag = tag.toLowerCase();
          const savedTag = await this.tagRepo.findOneBy({ name: lowerTag });

          if (savedTag) return savedTag;

          const tagEntity = this.tagRepo.create({
            name: lowerTag,
            tagId: v4()
          });

          return await this.tagRepo.save(tagEntity);
        })
      );

      let options = []
      if (productDetails.colors?.length) {
        options.push({ name: "Colors", values: productDetails.colors });
      }

      if (productDetails.sizes?.length) {
        options.push({ name: "Sizes", values: productDetails.sizes });
      }

      if (productDetails.properties?.length) {
        options.push(...productDetails.properties);
      }

      const existingOptions = await this.productOptionRepo.find({
        where: { product: { id: product.id } },
        relations: ["values"]
      });

      const updatedOptions: ProductOption[] = [];

      for (const opt of options) {
        const existing = existingOptions.find(o => o.name === opt.name);

        if (existing) {
          // Update existing option's values
          // First, remove old values (or handle updates if needed)
          await this.productOptionValueRepo.delete({ option: { id: existing.id } });

          existing.values = opt.values.map((v: string) =>
            this.productOptionValueRepo.create({ value: v })
          );

          const saved = await this.productOptionRepo.save(existing);
          updatedOptions.push(saved);
        } else {
          // Create new option
          const newOption = this.productOptionRepo.create({
            name: opt.name,
            product: product,
            values: opt.values.map((v: string) =>
              this.productOptionValueRepo.create({ value: v })
            )
          });

          const saved = await this.productOptionRepo.save(newOption);
          updatedOptions.push(saved);
        }
      }

      if (productDetails.specifications?.length) {
        const existingSpecs = await this.productSpecificationRepo.find({
          where: { product: { id: product.id } },
        });

        const updatedSpecs: ProductSpecification[] = [];

        for (const spec of productDetails.specifications) {
          // Try to find existing spec by name
          const existing = existingSpecs.find(s => s.name === spec.name);

          if (existing) {
            // Update value
            existing.value = spec.value;
            updatedSpecs.push(existing);
          } else {
            // New spec
            const newSpec = this.productSpecificationRepo.create({
              name: spec.name,
              value: spec.value,
              product,
            });
            updatedSpecs.push(newSpec);
          }
        }
        
        // Remove obsolete specs (those not in the new list)
        const incomingNames = productDetails.specifications.map(s => s.name);
        const toRemove = existingSpecs.filter(s => !incomingNames.includes(s.name));

        if (toRemove.length) {
          await this.productSpecificationRepo.remove(toRemove);
        }
        product.specifications = updatedSpecs
      }

      product.options = updatedOptions;
      product.name = productDetails.name
      product.searchName = productDetails.name.toLowerCase()
      product.category = category
      product.subCategory = subCategory
      product.brand = brand
      product.model = productDetails.model
      product.description = productDetails.description
      product.price = productDetails.price
      product.quantity = productDetails.quantity
      product.discount = productDetails.discount || 0
      product.tags = newtags

      return await this.productRepo.save(product)
    }catch(err){
      throw err
    }
  }

  async updateStatus(productId: string, updateProductStatusDto: UpdateProductStatusDto) {
    const product = await this.productRepo.findOne({
      where: {productId},
    })

    return await this.productRepo.update(product.id, {
      status: updateProductStatusDto.status
    })
  }

  async updateReviewStatus(productId: string, updateProductReviewStatusDto: UpdateProductReviewStatusDto) {
    const product = await this.productRepo.findOne({
      where: {productId},
      relations: {
        productReview: true
      }
    })
    product.productReview.status = updateProductReviewStatusDto.status
    await this.productRepo.save(product)
  }

  async updateProductImage(productId: string, filename:string) {
    const product = await this.productRepo.findOne({
      where: {productId},
    })

    return await this.productRepo.update(product.id, {
      imageName: filename
    });
  }

  async upsertMonthHistoryProducts(queryRunner: QueryRunner){
    const day = GetDay()
    const month = GetMonth()
    const year = GetYear()
    
    const monthHistory = await this.monthHistoryRepo.findOne({
      where: { day, month, year }
    })

    if(monthHistory){
      monthHistory.products += 1
      return await queryRunner.manager.save(MonthHistory, {...monthHistory})
    }else{
      const newMonthHistory = this.monthHistoryRepo.create({
        day, month, year, products: 1
    })
      return await queryRunner.manager.save(MonthHistory, {...newMonthHistory})
    }

  }
  
  async upsertYearHistoryProducts(queryRunner: QueryRunner){
    const month = GetMonth()
    const year = GetYear()
    
    const yearHistory = await this.yearHistoryRepo.findOne({
      where: { month, year }
    })

    if(yearHistory){
      yearHistory.products += 1
      return await queryRunner.manager.save(YearHistory, {...yearHistory})
    }else{
      const newYearHistory = this.yearHistoryRepo.create({
        month, year, products: 1
    })
      return await queryRunner.manager.save(YearHistory, {...newYearHistory})
    }

  }

  async upsertUserMonthHistoryProducts(userId:number, queryRunner: QueryRunner){
    const day = GetDay()
    const month = GetMonth()
    const year = GetYear()
    
    const monthHistory = await this.userMonthHistoryRepo.findOne({
      where: { day, month, year, userId }
    })

    if(monthHistory){
      monthHistory.products += 1
      return await queryRunner.manager.save(UserMonthHistory, {...monthHistory})
    }else{
      const newMonthHistory = this.userMonthHistoryRepo.create({
        day, month, year, products: 1, userId
    })
      return await queryRunner.manager.save(UserMonthHistory, {...newMonthHistory})
    }
  }

  async upsertUserYearHistoryProducts(userId:number, queryRunner: QueryRunner){
    const month = GetMonth()
    const year = GetYear()
    
    const yearHistory = await this.userYearHistoryRepo.findOne({
      where: { month, year, userId }
    })

    if(yearHistory){
      yearHistory.products += 1
      return await queryRunner.manager.save(UserYearHistory, {...yearHistory})
    }else{
      const newYearHistory = this.userYearHistoryRepo.create({
        month, year, products: 1, userId, orders: 0
    })
      return await queryRunner.manager.save(UserYearHistory, {...newYearHistory})
    }
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
