import { ApiResponseProperty } from "@nestjs/swagger"

export class BannerResponseDto {
    @ApiResponseProperty({
        example: 1
    })
    id:number 

    @ApiResponseProperty({
        example: "00000-00000-00000-00000-00000"
    })
    public bannerId?:string
    
    @ApiResponseProperty({
        example: "something.png"
    })
    public imageName:string 
    
    @ApiResponseProperty({
        example: "https://something.png"
    })
    public imageUrl?:string 

    constructor(partial:Partial<BannerResponseDto>){
        Object.assign(this, partial)
    }
}
