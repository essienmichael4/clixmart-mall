import { ApiResponseProperty } from "@nestjs/swagger"
import { Exclude } from "class-transformer"
import { ProductResponseDto } from "src/product/dto/response.dto"
import { UserResponseDto } from "src/user/dto/userResponse.dto"

class OrderItemDto {
    @ApiResponseProperty({
        example: 1
    })
    @Exclude()
    id:number 

    @ApiResponseProperty({
        example: 1
    })
    orderItemId:string 

    @ApiResponseProperty({
        example: "000000000000000000000000"
    })
    public name:string

    @ApiResponseProperty({
        example: "000000000000000000000000"
    })
    public price:number

    @ApiResponseProperty({
        example: "000000000000000000000000"
    })
    public quantity:number

    @ApiResponseProperty({
        example: "000000000000000000000000"
    })
    public subTotal:number

    @ApiResponseProperty({
        example: "000000000000000000000000"
    })
    public isDeleted:string
    
    @ApiResponseProperty({
        example: "PENDING"
    })
    public status:string 

    @ApiResponseProperty({
        type: ProductResponseDto
    })
    product: ProductResponseDto
}

export class OrderReponseDto{
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
        type: [OrderItemDto]
    })
    orderItems: OrderItemDto[]

    @ApiResponseProperty({
        type: UserResponseDto
    })
    user: UserResponseDto

    constructor(partial:Partial<OrderReponseDto>){
        Object.assign(this, partial)
    }
}
