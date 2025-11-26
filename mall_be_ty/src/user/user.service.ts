import { HttpException, Injectable } from '@nestjs/common';
import { AddressDto, CreateUserDto, FindUsersDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPasswordRequest, UpdateUserRequest } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, In, Like, QueryRunner, Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';
import { v4 } from 'uuid';
import { GetDay, GetMonth, GetYear } from 'src/helpers/common';
import { MonthHistory } from 'src/product/entities/MonthHistory.entity';
import { YearHistory } from 'src/product/entities/YearHistory.entity';
import { Address } from './entities/address.entity';
import { Department } from './entities/department.entity';
import e from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo:Repository<User>,
    @InjectRepository(Address) private readonly addressRepo:Repository<Address>,
    @InjectRepository(MonthHistory) private readonly monthHistoryRepo:Repository<MonthHistory>,
    @InjectRepository(YearHistory) private readonly yearHistoryRepo:Repository<YearHistory>,
    private readonly dataSource:DataSource
  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // 1. Prepare base user
      const userEntity = this.userRepo.create();
      const saveEntity = {
        ...userEntity,
        name:createUserDto.name,
        email:createUserDto.email.toLowerCase(),
        role: createUserDto.role,
        userId: v4(),
        password: await this.hashPassword(createUserDto.password),
        searchName: createUserDto.name.toLowerCase(),
      };

      // 2. Save user
      const user = await this.createUser(saveEntity, queryRunner);

      // 3. Attach departments (if provided)
      if (createUserDto.departments && createUserDto.departments.length > 0) {
        // fetch departments by name or id
        const departments = await queryRunner.manager.find(Department, {
          where: {
            name: In(createUserDto.departments) // if using names
            // id: In(createUserDto.departments) // if using ID instead
          }
        });

        user.departments = departments;

        // save updated user with relations
        await queryRunner.manager.save(user);
      }

      // 4. Update historical stats
      await this.upsertMonthHistoryUsers(queryRunner);
      await this.upsertYearHistoryUsers(queryRunner);

      await queryRunner.commitTransaction();
      return user;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }


  async createUser(payload:User, queryRunner:QueryRunner){
    return await queryRunner.manager.save(User, {
      ...payload
    })
  }

  async addAddress(id:number, addressDto:AddressDto){
    try{
      const user = await this.userRepo.findOne({
        where: {
         id
        }
      })
      const addressEntity = this.addressRepo.create()

      const saveEntity = {
        ...addressEntity,
        addressId: v4(),
        country: addressDto.country,
        state: addressDto.state,
        city: addressDto.city,
        zip: addressDto.zip,
        addressLineOne: addressDto.addressLineOne,
        addressLineTwo: addressDto.addressLineTwo,
        landmark: addressDto.landmark,
        user
      }
      console.log(saveEntity)

      const address = await this.addressRepo.save(saveEntity) 

      return address
    }catch(err){
      throw err
    }
  }

  findAll() {
    return this.userRepo.find()
  }

  findUsersByFilters(filters:FindUsersDto) {
    // return `This action returns all user`;
    const {email, name} = filters

    const users = this.userRepo.find({
      where: [
        {searchName: Like(`%${name.toLowerCase()}%`)},
        {email: Like(`%${email.toLowerCase()}%`)}
      ]
    })

    return users
  }
  
  async findUserByEmail(email:string){
    return await this.userRepo.findOneBy({email})
  }

  async findUserById(id:number){
    return await this.userRepo.findOne({
      relations: {
        addresses: true
      },
      where: {id}
    })
  }
  
  findOne(id: number) {
    return this.userRepo.findOne({
      relations: {
        addresses: true
      },
      where: {id}
    })
  }
  
  async resetPassword(id: number, password:string) {
    try{
      return await this.userRepo.update(id, {
        password: await this.hashPassword(password)
      })
    }catch(err){
      throw err
    }
  }

  async updateUserPassword(id:number, fields:UpdateUserPasswordRequest){
    try{
      const updatedUser = await this.findUserById(id)
      if(!updatedUser) throw new HttpException("User does not exist", 401)

      const isValidPassword = await compare(fields.oldPassword, updatedUser.password)
      if(!isValidPassword) throw new HttpException("Old password does not match the existing password", 401)

      if(fields.newPassword !== fields.confirmPassword) throw new HttpException("New passwords do not match", 401)
  
        
      await this.userRepo.update(id, {
        password: await this.hashPassword(fields.newPassword)
      })
  
      return await this.userRepo.findOneBy({id})
    }catch(err){
      throw err
    }
  }

  
  async update(id: number, fields:UpdateUserRequest) {
    const {phone, name} = fields
    await this.userRepo.update(id, {
      ...(name && { name: name }),
      ...(name && { searchName: name.toLowerCase() }),
      ...(phone && { phone }),
    })
  
    return await this.userRepo.findOneBy({id});
  }

  async updateAddress(addressId:number, addressDto:AddressDto){
    try{
      const address = await this.addressRepo.findOne({
        where: {
          id: addressId
        }
      })

      address.country = addressDto.country
      address.state = addressDto.state
      address.city = addressDto.city
      address.zip = addressDto.zip
      address.addressLineOne = addressDto.addressLineOne
      address.landmark = addressDto.landmark
      if(addressDto.addressLineTwo){
        address.addressLineTwo = addressDto.addressLineTwo
      }

      await this.addressRepo.update(address.id, address)

      return address
    }catch(err){
      throw err
    }
  }

  async upsertMonthHistoryUsers(queryRunner: QueryRunner){
    const day = GetDay()
    const month = GetMonth()
    const year = GetYear()
    
    const monthHistory = await this.monthHistoryRepo.findOne({
      where: { day, month, year }
    })

    if(monthHistory){
      monthHistory.users += 1
      return await queryRunner.manager.save(MonthHistory, {...monthHistory})
    }else{
      const newMonthHistory = this.monthHistoryRepo.create({
        day, month, year, users: 1
    })
      return await queryRunner.manager.save(MonthHistory, {...newMonthHistory})
    }

  }
  
  async upsertYearHistoryUsers(queryRunner: QueryRunner){
    const month = GetMonth()
    const year = GetYear()
    
    const yearHistory = await this.yearHistoryRepo.findOne({
      where: { month, year }
    })

    if(yearHistory){
      yearHistory.users += 1
      return await queryRunner.manager.save(YearHistory, {...yearHistory})
    }else{
      const newYearHistory = this.yearHistoryRepo.create({
        month, year, users: 1
    })
      return await queryRunner.manager.save(YearHistory, {...newYearHistory})
    }

  }
    
  remove(id: number) {
    return `This action removes a #${id} user`;
  }
  
  async hashPassword(password:string){
    const hashedPassword = await hash(password, 10)
    return hashedPassword
  }
}
  