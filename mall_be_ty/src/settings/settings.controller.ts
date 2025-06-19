import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseInterceptors, BadRequestException, HttpStatus, ParseFilePipeBuilder, Req, UploadedFile, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { ApiConsumes, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFile } from 'src/decorators/file.decorator';
import { ImageFileFilter } from 'src/helpers/file-helper';
import { v4 } from 'uuid';
import { UploadService } from 'src/upload/upload.service';
import { TaxDto } from './dto/Tax.dto';
import { Role } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';

const MAX_IMAGE_SIZE_IN_BYTE = 2 * 1024 * 1024

@Controller('settings')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true
}))
@ApiTags("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService, private readonly uploadService:UploadService) {}

  @Post('banners')
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
  async addBanner(@Req() req:any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({maxSize: MAX_IMAGE_SIZE_IN_BYTE})
        .build({errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY})
  ) file: Express.Multer.File){
    if(!file || req.fileValidationError){
      throw new BadRequestException("Invalid file provided, [Image files allowed]")
    }
    const buffer = file.buffer
    const filename = `${v4()}-${file.originalname.replace(/\s+/g,'')}`
    const upload = await this.uploadService.addBanner(buffer, filename) 
    return this.settingsService.addBannerImage(filename);
  }

  @Get('banners')
  findBanners() {
    return this.settingsService.findAllBanners();
  }

  @Role("ADMIN")
  @UseGuards(RolesGuard)
  @Get('tax')
  findTax() {
    console.log("in");
    
    return this.settingsService.findTax();
  }

  @Role("ADMIN")
  @UseGuards(RolesGuard)
  @Post('tax')
  createTax(@Body() taxDto: TaxDto, @User() user:UserInfo) {
    return this.settingsService.createTax(taxDto, user.sub.id);
  }

  @Role("ADMIN")
  @UseGuards(RolesGuard)
  @Patch('tax/:id')
  updateTax(@Param('id', ParseIntPipe) id: number, @Body() taxDto: TaxDto, @User() user:UserInfo) {
    return this.settingsService.updateTax(id, taxDto, user.sub.id);
  }

  @Role("ADMIN")
  @UseGuards(RolesGuard)
  @Delete('banners/:id')
  deleteBanner(@Param('id') id: string) {
    return this.settingsService.deleteBanner(id);
  }
}
