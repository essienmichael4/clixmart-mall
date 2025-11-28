import { IsDefined, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class HubDto {
    @ApiProperty({
        description: "name",
        example: "Accra Central Hub",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 

    @ApiProperty({
        type: String,
        isArray: true,
        description: "option values",
        example: ["Sorting Center", "Pickup Point"],
        required: false
    })
    @IsOptional()
    types?:string[]
}

export class HubTypeDto {
    @ApiProperty({
        description: "name",
        example: "Sorting Center",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 

    @ApiProperty({
        description: "description",
        example: "Sorting center for all incoming packages",
        required: true
    })
    @IsString()
    @IsOptional()
    description?:string 
}

