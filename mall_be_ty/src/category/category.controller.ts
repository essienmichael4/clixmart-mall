import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryResponseDto, SubCategoryResponseDto } from './dto/categoryResponse.dto';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';

@Controller('category')
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
  @Post(":id/sub-categories")
  createSubCategory(@Param('id', ParseIntPipe) id: number, @Body() createSubCategoryDto: CreateSubCategoryDto) {
    return this.categoryService.createSubCategory(id, createSubCategoryDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({type: [CategoryResponseDto], description: ""})
  @ApiOperation({description: "Get all categories"})
  @ApiConsumes("application/json")
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
  @ApiOperation({description: "Get single categories"})
  @ApiConsumes("application/json")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
