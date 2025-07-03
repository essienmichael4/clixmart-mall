import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { SuccessfulOrderEventDto } from 'src/mailer/dto/successOrder.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/roles.guard';

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

  @Role("ADMIN")
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createCommissionDto: CreateCommissionDto) {
    return this.commissionService.create(createCommissionDto);
  }

  @Get()
  findCommissions() {
    return this.commissionService.findAll();
  }

  @Get('transactions/:status')
  findItemTransactions(){
    return this.commissionService.findTransactions()
  }

  @Get('transactions/stores/:status')
  findStoreTransactions(){
    return this.commissionService.findStoresTransactions()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commissionService.findOne(+id);
  }

  @Role("ADMIN")
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommissionDto: UpdateCommissionDto) {
    return this.commissionService.update(+id, updateCommissionDto);
  }

  @Role("ADMIN")
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commissionService.remove(+id);
  }
}
