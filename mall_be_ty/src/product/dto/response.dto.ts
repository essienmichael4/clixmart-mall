import { ApiResponseProperty } from "@nestjs/swagger"
import { Exclude } from "class-transformer"
import { BrandReponse } from "src/brand/dto/response.dto"
import { CategoryResponseDto, SubCategoryResponseDto } from "src/category/dto/categoryResponse.dto"

class ProductReviewResponseDto {
    @ApiResponseProperty({
        example: 1
    })
    id:number 

    @ApiResponseProperty({
        example: "000000000000000000000000"
    })
    public description?:string
    
    @ApiResponseProperty({
        example: "PENDING"
    })
    public status:string 
}

export class ProductReponseDto{
    @ApiResponseProperty({
        example: 1
    })
    id:number 

    @ApiResponseProperty({
        example: "samsung galaxy s3"
    })
    public name:string

    @ApiResponseProperty({
        example: "samung-galaxy-s3"
    })
    public slug?:string

    @ApiResponseProperty({
        example: 5000
    })
    public price:number

    @ApiResponseProperty({
        example: 15
    })
    public quantity:number 

    @ApiResponseProperty({
        example: 15
    })
    public discount:number 

    @ApiResponseProperty({
        example: "0000000000000"
    })
    public description:string 

    @ApiResponseProperty({
        example: "galaxy"
    })
    public model:string 
    
    @ApiResponseProperty({
        example: "galaxy"
    })
    public imageUrl:string 

    @ApiResponseProperty({
        example: "IN_STOCK"
    })
    public inventory:string 

    @ApiResponseProperty({
        example: "FALSE"
    })
    public isDisounted:string 

    @ApiResponseProperty({
        example: "DRAFT"
    })
    public status:string 

    @ApiResponseProperty({
        example: "1000000000000"
    })
    public createdAt:Date 

    @ApiResponseProperty({
        example: "0000000000000"
    })
    public updatedAt:Date 

    @Exclude()
    imageName: string

    @ApiResponseProperty({
        type: BrandReponse
    })
    brand: BrandReponse

    @ApiResponseProperty({
        type: CategoryResponseDto
    })
    category: CategoryResponseDto

    @ApiResponseProperty({
        type: SubCategoryResponseDto
    })
    subCategory: SubCategoryResponseDto

    @ApiResponseProperty({
        type: ProductReviewResponseDto
    })
    review: ProductReviewResponseDto

    constructor(partial:Partial<ProductReponseDto>){
        Object.assign(this, partial)
    }
}
