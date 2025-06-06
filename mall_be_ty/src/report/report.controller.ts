import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ReportService } from './report.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('reports')
@UsePipes(new ValidationPipe({
  whitelist: true,
  transform: true
}))
@ApiTags("reports")
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
  
  @Get('admin/top-vendors')
  getTopVendors() {
    return this.reportService.getTopVendors();
  }

  @Get('vendor/:id/summary')
  getVendorSummary(@Param('id') vendorId: number) {
    return this.reportService.getVendorSummary(vendorId);
  }

  @Get('vendor/:id/account-statement')
  async getStatement(
    @Param('id') vendorId: number, @Query('start') start: string, @Query('end') end: string,
  ) {
    return this.reportService.getVendorAccountStatement(
      vendorId,
      new Date(start),
      new Date(end),
    );
  }
}
