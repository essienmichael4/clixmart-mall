import { Controller, Get, Param, Query } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatiticsRequestDto, StatsHistoryDto } from './dto/request.dto';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('admin')
  adminStats( @Query() statiticsRequestDto:StatiticsRequestDto) {
    return this.statsService.getAdminStatistics(statiticsRequestDto.from, statiticsRequestDto.to);
  }

  @Get('vendor/:store')
  vendorStats(@Param('store') store: string, @Query() statiticsRequestDto:StatiticsRequestDto) {
    return this.statsService.getStoreStatistics(store, statiticsRequestDto.from, statiticsRequestDto.to);
  }

  @Get('history-periods')
  historyPeriods() {
    return this.statsService.getPeriods();
  }

  @Get('admin-history')
  adminHistory(@Query() statsHistoryDto:StatsHistoryDto) {
    return this.statsService.getHistoryData(statsHistoryDto.timeframe, statsHistoryDto.month, statsHistoryDto.year);
  }

  @Get('vendor-history')
  vendorHistory(@Query() statsHistoryDto:StatsHistoryDto) {
    return this.statsService.getUserHistoryData(statsHistoryDto.timeframe, statsHistoryDto.month, statsHistoryDto.year);
  }
}
