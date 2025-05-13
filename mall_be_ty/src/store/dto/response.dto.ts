import { ApiResponseProperty } from "@nestjs/swagger"
import { Exclude } from "class-transformer"
import { ProductResponseDto } from "src/product/dto/response.dto"
import { UserResponseDto } from "src/user/dto/userResponse.dto"

class StoreReviewResponseDto {
    @ApiResponseProperty({
        example: 1
    })
    id:number 

    @ApiResponseProperty({
        example: "ertyuiih-sdfghjkkvv-xxxxxxxxxxxx"
    })
    storeReviewId:string 

    @ApiResponseProperty({
        example: "000000000000000000000000"
    })
    public description?:string
    
    @ApiResponseProperty({
        example: "PENDING"
    })
    public status:string 

    @ApiResponseProperty({
        type: UserResponseDto
    })
    user?: UserResponseDto
}

class StoreAddressResponseDto {
    @ApiResponseProperty({
        example: 1
    })
    id:number 

    @ApiResponseProperty({
        example: "000000000000000000000000"
    })
    public storeAddressId:string
    
    @ApiResponseProperty({
        example: "Ghana"
    })
    public country:string 
    
    @ApiResponseProperty({
        example: "Accra"
    })
    public state?:string 
    
    @ApiResponseProperty({
        example: "Tema"
    })
    public city?:string 
    
    @ApiResponseProperty({
        example: "121 Avenue Street"
    })
    public addressLine:string 
    
    @ApiResponseProperty({
        example: "12 Oakwood Ridge"
    })
    public addressLineTwo?:string 
    
    @ApiResponseProperty({
        example: "xxxxxxxxx"
    })
    public phone:string 
    
    @ApiResponseProperty({
        example: "0000"
    })
    public zip:string 
    
    @ApiResponseProperty({
        example: "Landmark"
    })
    public landmark?:string 
}

class StoreDetailsResponseDto {
    @ApiResponseProperty({
        example: 1
    })
    id:number 

    @ApiResponseProperty({
        example: "000000000000000000000000"
    })
    public storeDetailId:string
    
    @ApiResponseProperty({
        example: "TRUE"
    })
    public isRegistered:string 
    
    @ApiResponseProperty({
        example: "Accra"
    })
    public nationalId?:string 
}

class PaymentDetailsResponseDto {
    @ApiResponseProperty({
        example: 1
    })
    id:number 

    @ApiResponseProperty({
        example: "000000000000000000000000"
    })
    public paymentDetailId:string
    
    @ApiResponseProperty({
        example: "MOMO"
    })
    public paymentMode:string 
    
    @ApiResponseProperty({
        example: "Accra"
    })
    public accountName:string 
    
    @ApiResponseProperty({
        example: "Accra"
    })
    public accountNumber:string 
    
    @ApiResponseProperty({
        example: "Accra"
    })
    public provider:string 
}

class NextOfKinResponseDto {
    @ApiResponseProperty({
        example: 1
    })
    id:number 

    @ApiResponseProperty({
        example: "000000000000000000000000"
    })
    public nextOfKinId:string
    
    @ApiResponseProperty({
        example: "MOMO"
    })
    public name:string 
    
    @ApiResponseProperty({
        example: "Accra"
    })
    public phone:string
}

export class StoreReponseDto{
    @ApiResponseProperty({
        example: 1
    })
    id:number 

    @ApiResponseProperty({
        example: "edghjydhfdh-sdfghudtyds-xxxxxxxxxxx"
    })
    storeId:string 

    @ApiResponseProperty({
        example: "samsung galaxy s3"
    })
    public name:string

    @ApiResponseProperty({
        example: "samung-galaxy-s3"
    })
    public slug?:string

    @ApiResponseProperty({
        example: "https://clixmart.com/store-name"
    })
    public url:string

    @ApiResponseProperty({
        example: "https://image.png"
    })
    public imageUrl:string 

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
        type: StoreAddressResponseDto
    })
    storeAddress: StoreAddressResponseDto

    @ApiResponseProperty({
        type: StoreDetailsResponseDto
    })
    storeDetail: StoreDetailsResponseDto

    @ApiResponseProperty({
        type: PaymentDetailsResponseDto
    })
    paymentDetail: PaymentDetailsResponseDto

    @ApiResponseProperty({
        type: StoreReviewResponseDto
    })
    review: StoreReviewResponseDto

    @ApiResponseProperty({
        type: NextOfKinResponseDto
    })
    nextOfKin: NextOfKinResponseDto

    @ApiResponseProperty({
        type: [ProductResponseDto]
    })
    products?: ProductResponseDto[]

    constructor(partial:Partial<StoreReponseDto>){
        Object.assign(this, partial)
    }
}
