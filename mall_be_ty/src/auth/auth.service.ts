import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { ForgottenPasswordDto, UserSignUpDto } from './dto/register.dto';
import { LoginReponse, UserAuthReponse } from './dto/response.dto';
import { UserSignInDto } from './dto/signin.dto';
import { compare } from 'bcryptjs';

interface PayloadParams{
  username: string,
  sub: {
      id: number,
      name: string,
      role: string
  }
}

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) 
    private readonly userRepo:Repository<User>, 
    private userService: UserService,
    private jwtService:JwtService
  ){}

  async findUser(email:string){
    return await this.userService.findUserByEmail(email)
  }

  async register(userSignUpDto:UserSignUpDto){
    try{
      const userExists = await this.findUser(userSignUpDto.email)
      if(userExists) throw new ConflictException("Email already exists")

      const newUser = await this.userService.create(userSignUpDto)
      const user = new UserAuthReponse(newUser)

      return user
    }catch(err){
      throw err
    }
  }

  async login(userSignInDto:UserSignInDto){
    try{
      const userExists = await this.findUser(userSignInDto.email)
      if(!userExists) throw new HttpException("Invalid credentials", 401)

      const isValidPassword = await compare(userSignInDto.password, userExists.password)
      if(!isValidPassword) throw new HttpException("Invalid credentials", 401)
      const user = new UserAuthReponse(userExists)

      const payload = {
        username: user.email,
        sub: {
            id: user.id,
            name: user.name,
            role: user.role
        }
      }

      return new LoginReponse({
        ...user, 
        backendTokens: {
          accessToken: await this.signAuthPayload(payload), 
          refreshToken: await this.signRefreshPayload(payload)
        }
      })
    }catch(err){
      throw err
    }
  }

  async forgotPassword(forgottenPasswordDto:ForgottenPasswordDto){
    try{
      const userExists = await this.findUser(forgottenPasswordDto.email)
      if(!userExists) throw new HttpException("The account does not exist on this platform", 401)
    }catch(err){
      throw err
    }
  }

  async signAuthPayload(payload:PayloadParams){
    return this.jwtService.sign(payload, {
        expiresIn: "1h",
        secret: process.env.JWT_SECRET_KEY
    })
  }

  async resignAuthPayload(payload:PayloadParams){
      return this.jwtService.sign(payload, {
          secret: process.env.JWT_SECRET_KEY
      })
  }

  async signRefreshPayload(payload:PayloadParams){
      return this.jwtService.sign(payload, {
          expiresIn: "7d",
          secret: process.env.JWT_REFRESH_KEY
      })
  }
}
