import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Role } from "../entities/user.entity";

export class UpdateUserDto extends PartialType(CreateUserDto) {}


export class UpdateUserRequest {
    @IsString()
    @IsOptional()
    name:string 

    @IsEmail()
    @IsOptional()
    phone:string
}

export class UpdateUserRoleRequest {
    @IsEnum(Role)
    role?:Role 
}

export class UpdateUserPasswordRequest {
    @IsString()
    @IsOptional()
    oldPassword:string

    @IsString()
    newPassword:string

    @IsString()
    confirmPassword:string
}
