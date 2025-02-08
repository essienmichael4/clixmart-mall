import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpCode, HttpStatus, UseInterceptors, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFile, BadRequestException, Req } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileFilter } from 'src/helpers/file-helper';

@Controller('brands')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true
}))
@ApiTags("brands")
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('upload')
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("filename", {
      fileFilter: ImageFileFilter
    })
  )
  public async uploadFile(@Req() req:any,
    @UploadedFile(
      new ParseFilePipe({
          validators: [
              new MaxFileSizeValidator({maxSize: 3000}),
              new FileTypeValidator({fileType:"image/jpeg"})
          ]
      })
  ) file: Express.Multer.File){
    if(!file || req.fileValidationError){
      throw new BadRequestException("Invalid file provided, [Image file allowed]")
    }

    const buffer = file.buffer
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
  findAll() {
    return this.brandService.findAll();
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
