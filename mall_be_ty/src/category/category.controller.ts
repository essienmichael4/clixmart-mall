import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto, EditCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryResponseDto, SubCategoryResponseDto } from './dto/categoryResponse.dto';
import { CreateSubCategoryDto, EditSubCategoryDto } from './dto/create-sub-category.dto';

@Controller('categories')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true
}))
@ApiTags("categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

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

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: [CategoryResponseDto], description: ""})
  @ApiOperation({description: "Get all categories"})
  // @ApiConsumes("application/json")
  @Get()
  findAllCategories() {
    return this.categoryService.findAllCategories();
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: [CategoryResponseDto], description: ""})
  @ApiOperation({description: "Get all categories"})
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
  @ApiOperation({description: "Get single categories"})
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
