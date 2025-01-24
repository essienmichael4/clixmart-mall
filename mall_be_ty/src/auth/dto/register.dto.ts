import { ApiProperty } from "@nestjs/swagger"
import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator"
import { Role } from "src/user/entities/user.entity"

export class UserSignUpDto{
    @ApiProperty({
        description: "name",
        example: "John Doe",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 

    @ApiProperty({
        description: "email",
        example: "test@example.com",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsEmail()
    email:string

    @ApiProperty({
        description: "Password",
        example: "xxxxxxxxxxx",
        required: true
    })
    @IsDefined()
    @IsString()
    @MinLength(8)
    password?:string

    @ApiProperty({
        description: "Role",
        example: "USER",
        required: true
    })
    @IsEnum(Role)
    role:Role
}

export class ForgottenPasswordDto {
    @ApiProperty({
        description: "email",
        example: "test@example.com",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsEmail()
    email:string
}

export class ResetPasswordDto {
    @ApiProperty({
        description: "Password",
        example: "xxxxxxxxxxx",
        required: true
    })
    @IsDefined()
    @IsString()
    @MinLength(8)
    password:string

    @ApiProperty({
        description: "Password",
        example: "xxxxxxxxxxx",
        required: true
    })
    @IsDefined()
    @IsString()
    @MinLength(8)
    confirmPassword?:string
}
