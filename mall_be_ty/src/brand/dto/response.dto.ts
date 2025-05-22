import { ApiResponseProperty } from "@nestjs/swagger"
import { Category } from "src/category/entities/category.entity"
import { Product } from "src/product/entities/product.entity"

export class BrandReponse{
    @ApiResponseProperty({
        example: 1
    })
    id:number 

    @ApiResponseProperty({
        example: "John Doe"
    })
    public name:string

    @ApiResponseProperty({
        example: "test@example.com"
    })
    public url:string

    @ApiResponseProperty({
        example: "something.png"
    })
    public imageName?:string

    @ApiResponseProperty({
        example: "https://something.png"
    })
    public imageUrl?:string 

    
    @ApiResponseProperty({
        example: "1000000000000"
    })
    public createdAt:Date 

    @ApiResponseProperty({
        example: "0000000000000"
    })
    public updatedAt:Date 

    products?: Product[]

    categories?: Category[]

    constructor(partial:Partial<BrandReponse>){
        Object.assign(this, partial)
    }
}

// class Product {

// }

// class Category{

// }
