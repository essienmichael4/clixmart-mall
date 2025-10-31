import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {
    @ApiProperty({
        description: "Product name",
        example: "Electric iron",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    name:string 
}

export class ProductOptionsDto {
    @ApiProperty({
        description: "Option label",
        example: "Material",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    label:string 

    @ApiProperty({
        type: String,
        isArray: true,
        description: "option values",
        example: ["vintage", "cotton"],
        required: false
    })
    @IsOptional()
    value:string[]
}

export class ProductSpecificationsDto {
    @ApiProperty({
        description: "Option label",
        example: "Material",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsOptional()
    name:string 

    @ApiProperty({
        description: "Option label",
        example: "Material",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsOptional()
    value:string
}

export class ProductDetailsDto {
    @ApiProperty({
        description: "Product name",
        example: "Electric Kettle",
        required: false
    })
    @IsString()
    @IsOptional()
    name?:string 

    @ApiProperty({
        description: "Category name",
        example: "Electronics",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    category:string 

    @ApiProperty({
        description: "Sub category name",
        example: "Phones",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    subCategory:string 

    @ApiProperty({
        description: "Brand name",
        example: "Samsung",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    brand:string 

    @ApiProperty({
        description: "model",
        example: "Galaxy S23 Ultra",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    model:string 

    @ApiProperty({
        description: "price",
        example: 1500,
        required: true
    })
    @IsDefined()
    @IsNumber()
    price:number 

    @ApiProperty({
        description: "quantity",
        example: 15,
        required: true
    })
    @IsDefined()
    @IsNumber()
    quantity:number 

    @ApiProperty({
        description: "discount",
        example: 5,
        required: false
    })
    @IsNumber()
    @IsOptional()
    discount:number 

    @ApiProperty({
        description: "desription",
        example: "This is a nice product.",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    description:string 

    @ApiProperty({
        type: String,
        isArray: true,
        description: "tags",
        example: ["vintage", "cotton"],
        required: false
    })
    @IsOptional()
    tags:string[]

    @ApiProperty({
        type: String,
        isArray: true,
        description: "colors",
        example: ["#ffffff", "#000000"],
        required: false
    })
    @IsOptional()
    colors:string[]

    @ApiProperty({
        type: String,
        isArray: true,
        description: "product sizes",
        example: ["XS", "XXL"],
        required: false
    })
    @IsOptional()
    sizes:string[]

    properties?: ProductOptionsDto[]
    specifications?: ProductSpecificationsDto[]
}
