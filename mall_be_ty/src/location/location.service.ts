import { Injectable, NotFoundException } from '@nestjs/common';
// import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Mmda } from 'src/hub/entities/metropolitan.entity';
import { Region } from 'src/hub/entities/region.entity';
import { Town } from 'src/hub/entities/town.entity';
import { Repository } from 'typeorm';
import { CreateMmdaDto, CreateRegionDto, CreateTownDto } from './dto/create-location.dto';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Mmda) private readonly mmdaRepo:Repository<Mmda>,
    @InjectRepository(Region) private readonly regionRepo:Repository<Region>,
    @InjectRepository(Town) private readonly townRepo:Repository<Town>,
  ) {}

  async createRegion(dto: CreateRegionDto): Promise<Region> {
    const region = this.regionRepo.create(dto);
    return this.regionRepo.save(region);
  }

  async createTown(dto: CreateTownDto): Promise<Town> {
    const mmda = await this.mmdaRepo.findOne({ where: { id: dto.mmdaId } });
    
    return this.townRepo.save({
      name: dto.name,
      landmark: dto.landmark ?? null,
      postcode: dto.postcode ?? null,
      mmda, // relation attached
    });
  }

  async createMmda(dto: CreateMmdaDto): Promise<Mmda> {
    const mmda = this.mmdaRepo.create(dto);
    return this.mmdaRepo.save(mmda);
  }

  findAll() {
    return `This action returns all location`;
  }

  findAllTowns(){
    return this.townRepo.find()
  }

  findAllMmdas(){
    return this.mmdaRepo.find()
  }

  findAllRegions(){
    return this.regionRepo.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} location`;
  }

  async findRegionMmdas(regionId: number) {
    return this.mmdaRepo.find({
      where: { region: { id: regionId } },
      relations: ['region'],
      order: { name: 'ASC' }, // optional sorting
    });
  }

  async findMMDATowns(mmdaId: number) {
    const mmda = await this.mmdaRepo.findOne({
      where: { id: mmdaId },
      relations: ['towns'],  // Loads only towns under this MMDA
      order: { name: 'ASC' }
    });

    if (!mmda) {
      throw new NotFoundException(`MMDA not found`);
    }

    return mmda.towns.map(town => ({
      id: town.id,
      name: town.name
    }));
  }

  update(id: number, ) {
    return `This action updates a #${id} location`;
  }

  remove(id: number) {
    return `This action removes a #${id} location`;
  }
}
