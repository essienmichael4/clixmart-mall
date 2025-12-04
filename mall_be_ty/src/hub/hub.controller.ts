import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HubService } from './hub.service';
import { CreateHubDto } from './dto/create-hub.dto';
import { UpdateHubDto } from './dto/update-hub.dto';
import { HubTypeDto } from './dto/requests';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';

@Controller('hubs')
export class HubController {
  constructor(private readonly hubService: HubService) {}

  @Post()
  create(@Body() createHubDto: CreateHubDto) {
    return this.hubService.create(createHubDto);
  }

  @Post("types")
  createHubTypes(@Body() hubTypeDto: HubTypeDto) {
    return this.hubService.createHubType(hubTypeDto);
  }

  @Get()
  findAll(@Query() pageOptionsDto:PageOptionsDto, @Query("search") search?:string) {
    return this.hubService.findAll(pageOptionsDto, search);
  }

  @Get("types")
  findAllHubTypes() {
    return this.hubService.findAllHubTypes();
  }

  @Get("types/:id")
  findHubType(@Param('id') id: string) {
    return this.hubService.findHubType(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hubService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHubDto: UpdateHubDto) {
    return this.hubService.update(+id, updateHubDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hubService.remove(+id);
  }
}
