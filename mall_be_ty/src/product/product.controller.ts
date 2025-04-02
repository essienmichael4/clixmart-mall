import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, UseGuards, HttpCode, HttpStatus, ParseIntPipe, UseInterceptors, UploadedFile, Req, BadRequestException, UploadedFiles, ParseFilePipeBuilder, NotFoundException, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ProductDetailsDto } from './dto/create-product.dto';
import { UpdateProductDto, UpdateProductReviewStatusDto, UpdateProductStatusDto } from './dto/update-product.dto';
import { ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImageFileFilter } from 'src/helpers/file-helper';
import { UploadFile, UploadFiles } from 'src/decorators/file.decorator';
import { UploadService } from 'src/upload/upload.service';
import { uuid } from 'uuidv4';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { ApiPaginatedResponse } from 'src/decorators/pagination.decorator';
import { ProductReponseDto } from './dto/response.dto';

const MAX_IMAGE_SIZE_IN_BYTE = 2 * 1024 * 1024

@Controller('products')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true
}))
@ApiTags("products")
export class ProductController {
  constructor(private readonly productService: ProductService, private readonly uploadService:UploadService) {}
  
  @Post(':id/upload')
  @UploadFile('file')
  @ApiForbiddenResponse({description: 'UNAUTHORIZED_REQUEST'})
  @ApiUnprocessableEntityResponse({description: 'BAD_REQUEST'})
  @ApiInternalServerErrorResponse({description: 'INTERNAL_SERVER_ERROR'})
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("file", {
      fileFilter: ImageFileFilter
    })
  )
  public async uploadFile(@Param('id', ParseIntPipe) id: number, @Req() req:any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({maxSize: MAX_IMAGE_SIZE_IN_BYTE})
        .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
  ) file: Express.Multer.File){
    if(!file || req.fileValidationError){
      throw new BadRequestException("Invalid file provided, [Image files allowed]")
    }

    const product = await this.productService.findOne(id)
    if(!product) return new NotFoundException("Product not found")

    const buffer = file.buffer
    if(product.imageName){
      await this.uploadService.addProductImage(buffer, `products/${product.imageName}`)
      return product
    }

    const filename = `${uuid()}-${file.originalname.replace(/\s+/g,'')}`
    const upload = await this.uploadService.addProductImage(buffer, filename) 
    return await this.productService.updateProductImage(id, filename)
    
  }
  
  @Post(':id/uploads')
  @UploadFiles('files')
  @ApiForbiddenResponse({description: 'UNAUTHORIZED_REQUEST'})
  @ApiUnprocessableEntityResponse({description: 'BAD_REQUEST'})
  @ApiInternalServerErrorResponse({description: 'INTERNAL_SERVER_ERROR'})
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FilesInterceptor("files")
  )
  public async uploadFiles(@Param('id', ParseIntPipe) id: number, @Req() req:any,
    @UploadedFiles(
      new ParseFilePipeBuilder()
      .addFileTypeValidator({fileType: /(jpg|jpeg|png|gif|webp)$/})
        .addMaxSizeValidator({maxSize: MAX_IMAGE_SIZE_IN_BYTE})
        .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
    ) files: Array<Express.Multer.File>,){
    
    const fileUploadResults = []
    const fileNames = []
    for(const file of files){
        const filename = `${uuid()}-${file.originalname.replace(/\s+/g,'')}`
        const uploadFileResponse = await this.uploadService.addProductImage(file.buffer, filename)
        fileUploadResults.push({...uploadFileResponse, success: true})
        fileNames.push(filename)
    }
    // const buffer = file.buffer
    return await this.productService.addOtherProductImages(id, fileNames)
  }

  @UseGuards(JwtGuard)
  @Post(':store')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Product created successfully"})
  @ApiOkResponse({type: "", description: "Product created successfully"})
  @ApiOperation({description: "Create Product api"})
  @ApiConsumes("application/json")
  create(@Param('store') store: string, @Body() createProductDto: CreateProductDto, @User() user:UserInfo) {
    return this.productService.create(store, user.sub.id, createProductDto);
  }

  
  @UseGuards(JwtGuard)
  @Post(':store/:id/product-details')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Product created successfully"})
  @ApiOkResponse({type: "", description: "Product created successfully"})
  @ApiOperation({description: "Create Product api"})
  @ApiConsumes("application/json")
  async addProductDetails(@Param('store') store: string, @Param('id', ParseIntPipe) id: number, @Body() productDetails: ProductDetailsDto, @User() user:UserInfo) {
    const product = await this.productService.productDetails(store, id, productDetails);
    return product
  }
  
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ProductReponseDto)
  @ApiConsumes("application/json")
  findProducts(@Query() pageOptionsDto:PageOptionsDto, @Query("q") q?:string, @Query("category") category?:string, @Query("subCategory") subCategory?:string) {
    return this.productService.findProducts(pageOptionsDto, q, category, subCategory);
  }
  
  @Get('categories/:category')
  @HttpCode(HttpStatus.OK)
  @ApiPaginatedResponse(ProductReponseDto)
  @ApiConsumes("application/json")
  findProductsByCategory(@Query() pageOptionsDto:PageOptionsDto, @Query("category") category?:string, @Query("subCategories") subCategories?:string) {
    const allSubCategories = subCategories.split(",")
    if(allSubCategories.length > 0 && allSubCategories[0]!== ''){
      return this.productService.findProductsByCategoryAndSubCategories(pageOptionsDto, category, allSubCategories);
    }else{
      return this.productService.findProductsByCategory(pageOptionsDto, category);
    }
  }

  @Get("admin/all")
  findAll() {
    return this.productService.findAll();
  }
  
  @Get('store/:store')
  findAllStoreProducts(@Param('store') store: string) {
    return this.productService.findStoreProducts(store);
  }
  
  // @Get('categories/:category')
  // findCategoriesProducts(@Param('category') category: string, ) {
  //   return this.productService.findStoreProducts(category);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findProductByProductId(id);
  }

  @Get('cart/items')
  findCartItems(@Query("filter") filter:string) {
    const search = filter.split(',')
    if(search.length > 0 && search[0] == '') return
    return this.productService.findCartProducts(search)
  }

  @UseGuards(JwtGuard)
  @Get('/store/:store/:id')
  findStoreProduct(@Param('store') store: string, @Param('id') id: string) {
    return this.productService.findStoreProduct(store, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() updateProductStatusDto: UpdateProductStatusDto) {
    return this.productService.updateStatus(+id, updateProductStatusDto);
  }

  @Patch(':id/approval')
  updateReviewStatus(@Param('id') id: string, @Body() updateProductReviewStatusDto: UpdateProductReviewStatusDto) {
    return this.productService.updateReviewStatus(+id, updateProductReviewStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
