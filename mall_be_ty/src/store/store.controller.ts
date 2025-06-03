import { Controller, Get, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, ValidationPipe, UsePipes, HttpStatus, HttpCode, Post, BadRequestException, NotFoundException, ParseFilePipeBuilder, Req, UploadedFile, UseInterceptors} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto, NextOfKinDto, StoreAddressDto, StoreDetailsDto, StorePaymentDetailsDto } from './dto/create-store.dto';
import { UpdateStoreDto, UpdateStoreReviewDto } from './dto/update-store.dto';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiInternalServerErrorResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnprocessableEntityResponse } from '@nestjs/swagger';
import { UploadService } from 'src/upload/upload.service';
import { UploadFile } from 'src/decorators/file.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageFileFilter } from 'src/helpers/file-helper';
import { v4 } from 'uuid';
const MAX_IMAGE_SIZE_IN_BYTE = 2 * 1024 * 1024

@Controller('stores')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true
}))
@ApiTags("stores")
export class StoreController {
  constructor(private readonly storeService: StoreService, private readonly uploadService:UploadService) {}

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

    const store = await this.storeService.findOne(id)
    if(!store) return new NotFoundException("Store not found")

    // if( store.imageName ){
    //   await this.uploadService.deleteStoreImage(store.imageName)
    // }
    
    const buffer = file.buffer
    const filename = `${v4()}-${file.originalname.replace(/\s+/g,'')}`
    const upload = await this.uploadService.addStoreImage(buffer, filename) 
    
    return this.storeService.updateStoreImage(id, filename) 
  }

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Store created successfully"})
  @ApiOkResponse({type: "", description: "Store created successfully"})
  @ApiOperation({description: "Create Store api"})
  @ApiConsumes("application/json")
  create(@Body() createStoreDto: CreateStoreDto, @User() user:UserInfo) {
    return this.storeService.create(createStoreDto, user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Post(":id/store-details")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Store details added successfully"})
  @ApiOkResponse({type: "", description: "Store details added successfully"})
  @ApiOperation({description: "Create Store details api"})
  @ApiConsumes("application/json")
  addStoreDetail(@Param('id', ParseIntPipe) id: number, @Body() storeDetailsDto: StoreDetailsDto) {
    return this.storeService.addStoreDetails(id,storeDetailsDto);
  }

  @UseGuards(JwtGuard)
  @Post(":id/store-address")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Store address added successfully"})
  @ApiOkResponse({type: "", description: "Store address added successfully"})
  @ApiOperation({description: "Create Store address api"})
  @ApiConsumes("application/json")
  addStoreAddress(@Param('id', ParseIntPipe) id: number, @Body() storeAddressDto:StoreAddressDto) {
    return this.storeService.addStoreAddress(id, storeAddressDto);
  }

  @UseGuards(JwtGuard)
  @Post(":id/payment-details")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Store payment added successfully"})
  @ApiOkResponse({type: "", description: "Store payment added successfully"})
  @ApiOperation({description: "Create Store payment api"})
  @ApiConsumes("application/json")
  addStorePaymentDetails(@Param('id', ParseIntPipe) id: number, @Body() storePaymentDetailsDto: StorePaymentDetailsDto) {
    return this.storeService.addStorePaymentDetails(id, storePaymentDetailsDto);
  }

  @UseGuards(JwtGuard)
  @Post(":id/next-of-kin")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Store next of kin details added successfully"})
  @ApiOkResponse({type: "", description: "Store next of kin details added successfully"})
  @ApiOperation({description: "Create Store next of kin api"})
  @ApiConsumes("application/json")
  addNextOfKinDetails(@Param('id', ParseIntPipe) id: number, @Body() nextOfKinDto: NextOfKinDto) {
    return this.storeService.addNextOfKin(id, nextOfKinDto);
  }

  @UseGuards(JwtGuard)
  @Get("all")
  findAllUserStores(@User() user:UserInfo) {
    return this.storeService.findAllUserStores(user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAllStores() {
    return this.storeService.findAll();
  }

  @Get(':id/store-info')
  findStoreBySlug(@Param('id') id: string) {
    return this.storeService.findOne(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @Patch(":id/store-info")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Store info created successfully"})
  @ApiOkResponse({type: "", description: "Store info created successfully"})
  @ApiOperation({description: "Update Store info api"})
  @ApiConsumes("application/json")
  updateStoreInfo(@Param('id', ParseIntPipe) id: number, @Body() createStoreDto: CreateStoreDto) {
    return this.storeService.updateStoreInfo(id, createStoreDto);
  }
  
  @UseGuards(JwtGuard)
  @Patch(":id/store-details")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Store details updated successfully"})
  @ApiOkResponse({type: "", description: "Store details updated successfully"})
  @ApiOperation({description: "Update store details api"})
  @ApiConsumes("application/json")
  updateStoreDetail(@Param('id', ParseIntPipe) id: number, @Body() storeDetailsDto: StoreDetailsDto) {
    return this.storeService.updateStoreDetails(id, storeDetailsDto);
  }

  @UseGuards(JwtGuard)
  @Patch(":id/store-address")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Store address added successfully"})
  @ApiOkResponse({type: "", description: "Store address added successfully"})
  @ApiOperation({description: "Create Store address api"})
  @ApiConsumes("application/json")
  updateStoreAddress(@Param('id', ParseIntPipe) id: number, @Body() storeAddressDto:StoreAddressDto) {
    return this.storeService.updateStoreAddress(id, storeAddressDto);
  }

  @UseGuards(JwtGuard)
  @Patch(":id/payment-details")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Store payment updated successfully"})
  @ApiOkResponse({type: "", description: "Store payment updated successfully"})
  @ApiOperation({description: "Update Store payment api"})
  @ApiConsumes("application/json")
  updateStorePaymentDetails(@Param('id', ParseIntPipe) id: number, @Body() storePaymentDetailsDto: StorePaymentDetailsDto) {
    return this.storeService.updateStorePaymentDetails(id, storePaymentDetailsDto);
  }

  @UseGuards(JwtGuard)
  @Patch(":id/next-of-kin")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Store next of kin details added successfully"})
  @ApiOkResponse({type: "", description: "Store next of kin details added successfully"})
  @ApiOperation({description: "Create Store next of kin api"})
  @ApiConsumes("application/json")
  updateNextOfKinDetails(@Param('id', ParseIntPipe) id: number, @Body() nextOfKinDto: NextOfKinDto) {
    return this.storeService.updateNextOfKin(id, nextOfKinDto);
  }
  
  @UseGuards(JwtGuard)
  @Patch(':id/store')
  updateStoreName(@Param('id', ParseIntPipe) id: number, @Body() createStoreDto: CreateStoreDto, @User() user:UserInfo) {
    return this.storeService.updateStoreName(id, createStoreDto, user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/store-review')
  updateStoreReview(@Param('id', ParseIntPipe) id: number, @Body() updateStoreReviewDto: UpdateStoreReviewDto, @User() user:UserInfo) {
    return this.storeService.updateStoreReview(id, updateStoreReviewDto, user.sub.id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }
}
