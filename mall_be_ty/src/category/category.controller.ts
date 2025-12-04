import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode, HttpStatus, ParseIntPipe, Req, UseInterceptors, UploadedFile, ParseFilePipeBuilder, BadRequestException, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { UploadService } from 'src/upload/upload.service';
import { CreateCategoryDto, EditCategoryDto } from './dto/create-category.dto';
import { uuid } from 'uuidv4';
import { ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { CategoryResponseDto, SubCategoryResponseDto } from './dto/categoryResponse.dto';
import { CreateSubCategoryDto, CreateSubLevelSubCategoryDto, EditSubCategoryDto } from './dto/create-sub-category.dto';
import { UploadFile } from 'src/decorators/file.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileFilter } from 'src/helpers/file-helper';

const MAX_IMAGE_SIZE_IN_BYTE = 2 * 1024 * 1024

@Controller('categories')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true
}))
@ApiTags("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService, private readonly uploadService:UploadService) {}

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

    const category = await this.categoryService.findOneById(id)
    if(!category) return new NotFoundException("Category not found")

    // if( category.url ){
    //   await this.uploadService.deleteCategoryImage(category.url)
    // }
    
    const buffer = file.buffer
    const filename = `${uuid()}-${file.originalname.replace(/\s+/g,'')}`
    const upload = await this.uploadService.addCategoryImage(buffer, filename) 
    
    return this.categoryService.updateCategoryImage(id, filename) 
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: CategoryResponseDto, description: "Category created successfully"})
  @ApiOkResponse({type: CategoryResponseDto, description: "Category created successfully"})
  @ApiOperation({description: "Create Category api"})
  @ApiConsumes("application/json")
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOkResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOperation({description: "Create Sub Category api"})
  @ApiConsumes("application/json")
  @Post("sub-categories")
  async createSubCategory(@Body() createSubCategoryDto: CreateSubCategoryDto) {
    return  await this.categoryService.createSubCategory(createSubCategoryDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOkResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOperation({description: "Create Sub Category api"})
  @ApiConsumes("application/json")
  @Post("second-level-sub-categories")
  async createSecondLevelSubCategory(@Body() createSubLevelSubCategoryDto: CreateSubLevelSubCategoryDto) {
    return  await this.categoryService.createSecondLevelSubCategory(createSubLevelSubCategoryDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOkResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOperation({description: "Create Sub Category api"})
  @ApiConsumes("application/json")
  @Post("third-level-sub-categories")
  async createThirdLevelSubCategory(@Body() createSubLevelSubCategoryDto: CreateSubLevelSubCategoryDto) {
    // return  await this.categoryService.createThirdLevelSubCategory(createSubLevelSubCategoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: [CategoryResponseDto], description: ""})
  @ApiOperation({description: "Get all categories"})
  @Get()
  findAllCategories() {
    return this.categoryService.findAllCategories();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: [CategoryResponseDto], description: ""})
  @ApiOperation({description: "Get all sub categories"})
  @ApiConsumes("application/json")
  @Get("sub-categories/second-level-categories")
  findAllSecondLevelSubcategories() {
    return this.categoryService.findAllSecondLevelSubCategories();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: [CategoryResponseDto], description: ""})
  @ApiOperation({description: "Get all sub categories"})
  @ApiConsumes("application/json")
  @Get("sub-categories")
  findAllSubcategories() {
    return this.categoryService.findAllSubCategories();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: [CategoryResponseDto], description: ""})
  @ApiOperation({description: "Get all categories"})
  @ApiConsumes("application/json")
  @Get(":category/sub-categories")
  findCategorySubcategories(@Param('category') category: string) {
    return this.categoryService.findCategorySubCategories(category);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: [CategoryResponseDto], description: ""})
  @ApiOperation({description: "Get all categories"})
  @ApiConsumes("application/json")
  @Get(":subCategory/second-level-sub-categories")
  findSubCategorySecond(@Param('subCategory') subCategory: string) {
    return this.categoryService.findSubCategorySecond(subCategory);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: [CategoryResponseDto], description: ""})
  @ApiOperation({description: "Get all categories"})
  @ApiConsumes("application/json")
  @Get(":subCategory/third-level-sub-categories")
  findSubCategoryThird(@Param('subCategory') secondLevelSubCategory: string) {
    // return this.categoryService.findSubCategoryThird(secondLevelSubCategory);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: [CategoryResponseDto], description: ""})
  @ApiOperation({description: "Get single category"})
  @ApiConsumes("application/json")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOkResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOperation({description: "Update Category api"})
  @ApiConsumes("application/json")
  @Patch(':id')
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() editCategoryDto: EditCategoryDto) {
    return this.categoryService.updateCategory(id, editCategoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOkResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOperation({description: "Update Sub Category api"})
  @ApiConsumes("application/json")
  @Patch('sub-categories/:id')
  updateSubCategory(@Param('id', ParseIntPipe) id: number, @Body() editSubCategoryDto: EditSubCategoryDto) {
    return this.categoryService.updateSubCategory(id, editSubCategoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOkResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOperation({description: "Delete Category api"})
  @ApiConsumes("application/json")
  @Delete(':id')
  removeCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.removeCategory(id);
  }

  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOkResponse({type: SubCategoryResponseDto, description: "Sub Category created successfully"})
  @ApiOperation({description: "Delete Sub Category api"})
  @ApiConsumes("application/json")
  @Delete('sub-categories/:id')
  removeSubCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.removeSubCategory(id);
  }
}
