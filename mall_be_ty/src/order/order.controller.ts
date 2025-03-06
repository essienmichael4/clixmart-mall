import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User, UserInfo } from 'src/decorators/user.decorator';

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

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
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
