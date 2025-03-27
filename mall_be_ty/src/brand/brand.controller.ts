import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode, HttpStatus, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFile, BadRequestException, Req, ParseIntPipe, ParseFilePipeBuilder, NotFoundException } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileFilter } from 'src/helpers/file-helper';
import { UploadService } from 'src/upload/upload.service';
import { UploadFile } from 'src/decorators/file.decorator';
import { uuid } from 'uuidv4';
import { BrandReponse } from './dto/response.dto';

const MAX_IMAGE_SIZE_IN_BYTE = 2 * 1024 * 1024

@Controller('brands')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true
}))
@ApiTags("brands")
export class BrandController {
  constructor(private readonly brandService: BrandService, private readonly uploadService:UploadService) {}

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

    const brand = await this.brandService.findOne(id)
    if(!brand) return new NotFoundException("Brand not found")

    if( brand.url ){
      await this.uploadService.deleteBrandImage(brand.url)
    }
    const buffer = file.buffer
    const filename = `${uuid()}-${file.originalname.replace(/\s+/g,'')}`
    const upload = await this.uploadService.addBrandImage(buffer, filename) 
    
    return this.brandService.updateBrandImage(id, filename) 
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Brand created successfully"})
  @ApiOkResponse({type: "", description: "Brand created successfully"})
  @ApiOperation({description: "Create Brand api"})
  @ApiConsumes("application/json")
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandService.create(createBrandDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: "", description: ""})
  @ApiOperation({description: "Get all brands"})
  @Get()
  async findAll() {
    const brands = await this.brandService.findAll();

    const allBrands:BrandReponse[] = []
    for(const brand of brands){
      const partialBrand = new BrandReponse(brand)
      if(partialBrand.url) partialBrand.imageUrl = await this.uploadService.getPresignedUrl(partialBrand.url)
      allBrands.push(partialBrand)
    }

    return allBrands
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: "", description: ""})
  @ApiOperation({description: "Get all brands"})
  @Get("categories/:category")
  async findCategoryBrands(@Param('category') category: string) {
    const brands = await this.brandService.findByCategory(category)
    
    const allBrands:BrandReponse[] = []
    for(const brand of brands){
      const partialBrand = new BrandReponse(brand)
      if(partialBrand.url) partialBrand.imageUrl = await this.uploadService.getPresignedUrl(partialBrand.url)
      allBrands.push(partialBrand)
    }

    return allBrands
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: "", description: ""})
  @ApiOperation({description: "Get a brand"})
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  }
}
