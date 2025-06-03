import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseInterceptors, BadRequestException, HttpStatus, ParseFilePipeBuilder, Req, UploadedFile } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiConsumes, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadFile } from 'src/decorators/file.decorator';
import { ImageFileFilter } from 'src/helpers/file-helper';
import { v4 } from 'uuid';
import { UploadService } from 'src/upload/upload.service';

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
    const upload = await this.uploadService.addProductImage(buffer, filename) 
    return this.settingsService.addBannerImage(filename);
  }

  @Get('banners')
  findBanners() {
    return this.settingsService.findAllBanners();
  }
}
