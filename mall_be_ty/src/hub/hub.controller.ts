import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HubService } from './hub.service';
import { CreateHubDto } from './dto/create-hub.dto';
import { UpdateHubDto } from './dto/update-hub.dto';

@Controller('hubs')
export class HubController {
  constructor(private readonly hubService: HubService) {}

  @Post()
  create(@Body() createHubDto: CreateHubDto) {
    return this.hubService.create(createHubDto);
  }

  @Get()
  findAll() {
    return this.hubService.findAll();
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
