import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UsePipes, UseGuards, HttpCode, HttpStatus, ParseIntPipe, UseInterceptors, UploadedFile, ParseFilePipe, Req, MaxFileSizeValidator, FileTypeValidator, BadRequestException, UploadedFiles, ParseFilePipeBuilder, NotFoundException } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, ProductDetailsDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ImageFileFilter } from 'src/helpers/file-helper';
import { UploadFile, UploadFiles } from 'src/decorators/file.decorator';
import { UploadService } from 'src/upload/upload.service';
import { uuid } from 'uuidv4';

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

    const filename = `${uuid()}-${file.originalname}`
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
      .addFileTypeValidator({fileType: /(jpg|jpeg|png|gif)$/})
        .addMaxSizeValidator({maxSize: MAX_IMAGE_SIZE_IN_BYTE})
        .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
    ) files: Array<Express.Multer.File>,){
    
    const fileUploadResults = []
    const fileNames = []
    for(const file of files){
        const filename = `${uuid()}-${file.originalname}`
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
    console.log(productDetails);
    
    const product = await this.productService.productDetails(store, id, productDetails);
    console.log(product);
    return product
    
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }
  
  @Get(':store')
  findAllStoreProducts(@Param('store') store: string) {
    return this.productService.findStoreProducts(store);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Get(':store/:id')
  findStoreProduct(@Param('store') store: string, @Param('id', ParseIntPipe) id: number) {
    console.log({store, id});
    
    return this.productService.findStoreProduct(store, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
