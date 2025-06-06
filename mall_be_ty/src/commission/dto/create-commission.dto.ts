import { ApiProperty } from "@nestjs/swagger"
import { IsDefined, IsString, IsNotEmpty, IsNumber } from "class-validator"

export class CreateCommissionDto {
    @ApiProperty({
        description: "Sub-Category name",
        example: "Electronics",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    category:string
    
    @ApiProperty({
        description: "Commission rate",
        example: 10,
        required: true
    })
    @IsDefined()
    @IsNumber()
    rate:number 
}
