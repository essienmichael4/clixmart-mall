import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBrandDto {
    @ApiProperty({
        description: "Brand name",
        example: "Samsung",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 

    @ApiProperty({
        description: "Category name",
        example: "Phone Accesories",
        required: true
    })
    @IsArray()
    category:string[]
     
    @ApiProperty({
        description: "Category name",
        example: "Phone Accesories",
        required: true
    })
    @IsArray()
    @IsOptional()
    subCategory:string[] 
}
