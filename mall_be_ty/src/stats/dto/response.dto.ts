import { ApiResponseProperty } from "@nestjs/swagger"

export class HistoryDataDto {
    @ApiResponseProperty({
        example: 1
    })
    year:number 

    @ApiResponseProperty({
        example: 1
    })
    month:number
    
    @ApiResponseProperty({
        example: 1
    })
    day?:number 
    
    @ApiResponseProperty({
        example: 1
    })
    users?:number 
    
    @ApiResponseProperty({
        example: 1
    })
    stores?:number 
    
    @ApiResponseProperty({
        example: 1
    })
    revenue?:number 
    
    @ApiResponseProperty({
        example: 1
    })
    orders?:number 
    
    @ApiResponseProperty({
        example: 1
    })
    products?:number 
}
