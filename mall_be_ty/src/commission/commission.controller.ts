import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, HttpCode, HttpStatus, Query, ParseIntPipe } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { SuccessfulOrderEventDto } from 'src/mailer/dto/successOrder.dto';
import { ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Role } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { JwtGuard } from 'src/guards/jwt.guard';
import { User, UserInfo } from 'src/decorators/user.decorator';
import { PaymentDto } from 'src/store/dto/create-store.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';

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

  @UseGuards(JwtGuard)
  @Post("vendors/:id/payments")
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({type: "", description: "Store payment added successfully"})
  @ApiOkResponse({type: "", description: "Store payment added added successfully"})
  @ApiOperation({description: "Create Store payment api"})
  @ApiConsumes("application/json")
  MakeStorePayment(@Param('id') id: string, @Body() paymentDto: PaymentDto, @User() user:UserInfo) {
    return this.commissionService.processVendorPayout(id, paymentDto.amount, user.sub.id);
  }

  @Get()
  findCommissions() {
    return this.commissionService.findAll();
  }

  @Get('audit-logs')
  async getAuditLogs(@Query() pageOptionsDto:PageOptionsDto, @Query('search') search?: string, @Query('from') from?: string, @Query('to') to?: string, @Query('action') action?: string,
  ) {
    return this.commissionService.getAuditLogs( pageOptionsDto, search, from, to, action,
    );
  }

  @Get("history-ledger")
  async getLedger(@Query() pageOptionsDto: PageOptionsDto, @Query('search') search?: string, @Query('from') from?: string, @Query('to') to?: string
  ) {
    return this.commissionService.getLedger(pageOptionsDto, search, from, to);
  }

  @Get("accounts-ledger")
  async getAccountsLedger(@Query() pageOptionsDto: PageOptionsDto, @Query('accountId') accountId?: number, @Query('search') search?: string, @Query('type') type?: string, @Query('from') from?: string, @Query('to') to?: string,
  ) {
    return this.commissionService.getAccountsLedger(
      pageOptionsDto,
      accountId,
      search,
      type,
      from,
      to,
    );
  }

  @Get(':store/transactions/statistics')
  findStoreTransactionsStatistics(@Param('store') store: string,){
    return this.commissionService.findTransactions()
  }

  @Get('transactions/statistics')
  findTransactionsStatistics(){
    return this.commissionService.findTransactions()
  }

  @Get('transactions/:status')
  findItemTransactions(){
    return this.commissionService.findTransactions()
  }

  @Get(':store/transactions')
  findStoreTransactions(@Param('store') store: string,){
    return this.commissionService.findStoresTransactions()
  }

  @Get(':store/payouts')
  findStorePayouts(@Param('store') store: string,){
    return this.commissionService.findStorePayouts(store)
  }

  @Get('transactions/stores/:status')
  findStoresTransactions(){
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
