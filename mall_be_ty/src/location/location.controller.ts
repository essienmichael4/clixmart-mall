import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LocationService } from './location.service';
// import { UpdateLocationDto } from './dto/update-location.dto';
import { CreateMmdaDto, CreateRegionDto, CreateTownDto } from './dto/create-location.dto';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Post("regions")
  createRegion(@Body() dto: CreateRegionDto) {
    return this.locationService.createRegion(dto);
  }

  @Post("mmdas")
  createMmda(@Body() dto: CreateMmdaDto) {
    return this.locationService.createMmda(dto);
  }

  @Post("towns")
  createTown(@Body() dto: CreateTownDto) {
    return this.locationService.createTown(dto);
  }

  @Get("towns")
  findAllTowns() {
    return this.locationService.findAllTowns();
  }

  @Get("regions")
  findAllRegions() {
    return this.locationService.findAllRegions();
  }

  @Get("mmdas")
  findAllMmda() {
    return this.locationService.findAllMmdas();
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.locationService.findOne(+id);
  }
  
  @Get('regions/:regionId/mmdas')
  findRegionMmdas(@Param('regionId') regionId: number) {
    return this.locationService.findRegionMmdas(regionId);
  }

  @Get('mmdas/:mmdaId/towns')
async findMMDATowns(@Param('mmdaId') mmdaId: number) {
  return this.locationService.findMMDATowns(mmdaId);
}

  @Patch(':id')
  update(@Param('id') id: string,) {
    return this.locationService.update(+id, );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationService.remove(+id);
  }
}
