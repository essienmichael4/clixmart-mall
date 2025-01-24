import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto, FindUsersDto } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserPasswordRequest, UpdateUserRequest } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { compare, hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo:Repository<User>){}

  async create(createUserDto: CreateUserDto):Promise<User> {
    const userEntity = this.userRepo.create()
    const saveEntity = {
      ...userEntity,
      ...createUserDto,
      password: await this.hashPassword(createUserDto.password),
      name: createUserDto.name.toLowerCase(),
      email: createUserDto.email.toLowerCase()  
    }

    try{
      return await this.userRepo.save(saveEntity)
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
        {name: Like(`%${name.toLowerCase()}%`)},
        {email: Like(`%${email.toLowerCase()}%`)}
      ]
    })

    return users
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
      ...(name && { name: name.toLowerCase() }),
      ...(phone && { phone }),
    })
  
    return await this.userRepo.findOneBy({id});
  }
  
  async findUserByEmail(email:string){
    return await this.userRepo.findOneBy({email})
  }

  async findUserById(id:number){
    return await this.userRepo.findOneBy({id})
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async hashPassword(password:string){
    const hashedPassword = await hash(password, 10)
    return hashedPassword
  }
}
