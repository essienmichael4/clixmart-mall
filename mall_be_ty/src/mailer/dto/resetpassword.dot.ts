import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsString } from "class-validator";

export class ResetPasswordEventDto {
    @ApiProperty({
        description: "email",
        example: "John Doe",
        required: true
    })
    @IsDefined()
    @IsString()
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
        description: "email",
        example: "test@example.com",
        required: true
    })
    @IsDefined()
    @IsString()
    link:string
}
