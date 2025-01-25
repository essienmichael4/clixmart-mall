import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
    @ApiProperty({
        description: "Category name",
        example: "Electronics",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 
}

export class EditCategoryDto {
    @ApiProperty({
        description: "Category name",
        example: "Electronics",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 
}
