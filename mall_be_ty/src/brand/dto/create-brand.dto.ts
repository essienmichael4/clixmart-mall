import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";

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
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    category:string 
}
