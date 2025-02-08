import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, ValidationPipe, UsePipes, HttpStatus, HttpCode} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto, NextOfKinDto, StoreAddressDto, StoreDetailsDto, StorePaymentDetailsDto } from './dto/create-store.dto';
import { UpdateStoreDto, UpdateStoreReviewDto } from './dto/update-store.dto';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('stores')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true
}))
@ApiTags("stores")
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeService.findOne(+id);
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
