import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { FindDepartmentUserDto } from './dto/request.dto';

@Controller('departments')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Post()
  create(@Body() dto: CreateDepartmentDto) {
    return this.departmentService.create(dto);
  }

  @Get()
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id/users')
  findDepartmentUser(@Param('id', ParseIntPipe) id: number, @Query() pageOptionsDto:PageOptionsDto, @Query() filters:FindDepartmentUserDto) {
    return this.departmentService.findDepartmentUsers(pageOptionsDto, id, filters.name);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.departmentService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.departmentService.remove(+id);
  }

}
