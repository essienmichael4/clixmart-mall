import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class ProductFilterDto {
    @ApiProperty({
        description: "From date",
        example: 1,
        required: false
    })
    @IsString()
    @IsOptional()
    status?:string 

    @ApiProperty({
        description: "To date",
        example: 1,
        required: false
    })
    @IsString()
    @IsOptional()
    review?:string 
}
