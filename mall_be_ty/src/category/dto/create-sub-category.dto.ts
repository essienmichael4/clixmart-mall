import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class CreateSubLevelSubCategoryDto {
    @ApiProperty({
        description: "Sub-Category name",
        example: "Electronics",
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
    subCategory:string 
}

export class CreateSubCategoryDto {
    @ApiProperty({
        description: "Sub-Category name",
        example: "Electronics",
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

export class EditSubCategoryDto {
    @ApiProperty({
        description: "Sub-Category name",
        example: "Electronics",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string
}
