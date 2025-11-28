import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateHubDto } from './dto/create-hub.dto';
import { UpdateHubDto } from './dto/update-hub.dto';
import { HubTypeDto } from './dto/requests';
import { HubType } from './entities/hub-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Hub } from './entities/hub.entity';
import { Mmda } from './entities/metropolitan.entity';
import { Region } from './entities/region.entity';
import { Town } from './entities/town.entity';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';

@Injectable()
export class HubService {
  constructor(
    @InjectRepository(HubType) private readonly hubTypeRepo:Repository<HubType>,
    @InjectRepository(Hub) private readonly hubRepo:Repository<Hub>,
    @InjectRepository(Mmda) private readonly mmdaRepo:Repository<Mmda>,
    @InjectRepository(Region) private readonly regionRepo:Repository<Region>,
    @InjectRepository(Town) private readonly townRepo:Repository<Town>,
  ) {}

  async create(createHubDto: CreateHubDto) {
    const region = await this.regionRepo.findOneBy({ id: createHubDto.regionId });
    if (!region) throw new NotFoundException("Region not found");

    let mmda = null;
    if (createHubDto.mmdaId) {
      mmda = await this.mmdaRepo.findOneBy({ id: createHubDto.mmdaId });
      if (!mmda) throw new NotFoundException("MMDA not found");
    }

    let town = null;
    if (createHubDto.townId) {
      town = await this.townRepo.findOneBy({ id: createHubDto.townId });
      if (!town) throw new NotFoundException("Town not found");
    }

    let types = [];
    if (Array.isArray(createHubDto.types)) {
      types = await this.hubTypeRepo.find({ where: { name: In(createHubDto.types) } });
      if (types.length !== createHubDto.types.length) {
        throw new NotFoundException("One or more Hub types not found");
      }
    }

    const hub = this.hubRepo.create({
      name: createHubDto.name,
      region,
      mmda,
      town,
      types,
    });

    return this.hubRepo.save(hub);
  }

  createHubType(hubTypeDto: HubTypeDto) {
    return this.hubTypeRepo.save({
      name: hubTypeDto.name,
      description: hubTypeDto.description,
    });
  }

  async findAll(pageOptionsDto:PageOptionsDto, search?:string) {
    const [data, total] = await this.hubRepo.findAndCount({
      where: search ? { name: In([`%${search}%`]) } : {},
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
      relations: {types:true} // load related hub types
    });

    const pageMetaDto = new PageMetaDto({
      itemCount: total,
      pageOptionsDto,
    });
    
    return new PageDto(data, pageMetaDto);
  }

  findAllHubTypes() {
    return this.hubTypeRepo.find();
  }

  findOne(id: number) {
    return this.hubRepo.findOne({
      where: {id},
      relations: {types:true} // load related hub types
    });
  }

  findHubType(id: number) {
    return this.hubTypeRepo.findOneBy({id});
  }

  update(id: number, updateHubDto: UpdateHubDto) {
    return `This action updates a #${id} hub`;
  }

  remove(id: number) {
    return `This action removes a #${id} hub`;
  }
}
