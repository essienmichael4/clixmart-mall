import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from 'src/user/entities/department.entity';
import { User } from 'src/user/entities/user.entity';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department) private readonly departmentRepo: Repository<Department>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateDepartmentDto) {
    const department = this.departmentRepo.create(dto);
    return this.departmentRepo.save(department);
  }

  findAll() {
    return this.departmentRepo.find({ order: { name: 'ASC' } });
  }

  async findDepartmentUsers(
    pageOptionsDto: PageOptionsDto,
    departmentId: number,
    filters?: string
  ) {
    const query = this.userRepo
      .createQueryBuilder('user')
      .innerJoin('user.departments', 'department')
      .where('department.id = :departmentId', { departmentId });

    // Optional search filter
    if (filters && filters.trim() !== '') {
      query.andWhere(
        `(user.name LIKE :filter OR user.email LIKE :filter)`,
        { filter: `%${filters}%` }
      );
    }

    // Pagination (using your skip/take)
    query.skip(pageOptionsDto.skip).take(pageOptionsDto.take);

    // Fetch results
    const [users, total] = await query.getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto });

    return new PageDto(users, pageMetaDto);
  }


  async findOne(id: number) {
    const department = await this.departmentRepo.findOne({ where: { id } });
    if (!department) throw new NotFoundException('Department not found');
    return department;
  }

  async update(id: number, dto: UpdateDepartmentDto) {
    const department = await this.findOne(id);
    Object.assign(department, dto);
    return this.departmentRepo.save(department);
  }

  async remove(id: number) {
    const department = await this.findOne(id);
    return this.departmentRepo.remove(department);
  }
}
