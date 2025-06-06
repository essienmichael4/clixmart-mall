import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { SuccessfulOrderEventDto } from 'src/mailer/dto/successOrder.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('commissions')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true
}))
@ApiTags("commissions")
export class CommissionController {
  constructor(private readonly commissionService: CommissionService) {}

  @OnEvent("order.commission")
  calculateOrderCommission(@Body() payload:SuccessfulOrderEventDto){
    return this.commissionService.calculateCommission(payload)
  }

  @Post()
  create(@Body() createCommissionDto: CreateCommissionDto) {
    return this.commissionService.create(createCommissionDto);
  }

  @Get()
  findCommissions() {
    return this.commissionService.findAll();
  }

  // @Get()
  // findAll() {
  //   return this.commissionService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommissionDto: UpdateCommissionDto) {
    return this.commissionService.update(+id, updateCommissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commissionService.remove(+id);
  }
}
