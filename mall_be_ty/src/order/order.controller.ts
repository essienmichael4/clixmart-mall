import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, UsePipes, ValidationPipe, Query, ParseIntPipe, UnauthorizedException } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { OrderFilterDto } from './dto/request.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';

@Controller('orders')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true
}))
@ApiTags("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Order created successfully"})
  @ApiOkResponse({type: "", description: "Order created successfully"})
  @ApiOperation({description: "Create Order api"})
  @ApiConsumes("application/json")
  create(@Body() createOrderDto: CreateOrderDto, @User() user:UserInfo) {
    return this.orderService.create(createOrderDto, user.sub.id);
  }

  @UseGuards(JwtGuard)
  @Get()
  findAll(@Query() orderFilterDto:OrderFilterDto) {
    return this.orderService.findAll(orderFilterDto);
  }
  
  @UseGuards(JwtGuard)
  @Get("users/:id")
  findUsersOrders(@Query() pageOptionsDto:PageOptionsDto, @Param('id', ParseIntPipe) id: number, @Query() orderFilterDto:OrderFilterDto , @User() user:UserInfo) {
    try{
      if(id !== user.sub.id) throw new UnauthorizedException()
      return this.orderService.findUsersOrders(pageOptionsDto, user.sub.id, orderFilterDto);
    }catch(err){
      throw err
    }
  }
  
  @UseGuards(JwtGuard)
  @Get("users/:id/:orderId")
  findUsersOrder(@Param('orderId') orderId: string, @Param('id', ParseIntPipe) id: number, @User() user:UserInfo) {
    try{
      if(id !== user.sub.id) throw new UnauthorizedException()
      return this.orderService.findUsersOrder(user.sub.id, orderId);
    }catch(err){
      throw err
    }
  }

  @UseGuards(JwtGuard)
  @Get("stores/:store")
  findAllStoreOrders(@Param('store') store: string, @Query() orderFilterDto:OrderFilterDto) {
    return this.orderService.findAllStoreOrders(store, orderFilterDto);
  }

  @UseGuards(JwtGuard)
  @Get("stores/:store/:orderId")
  findAllStoreOrderItems(@Param('store') store: string, @Param('orderId') orderId: string,) {
    return this.orderService.findStoreOrderItem(store, orderId);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
