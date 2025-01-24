import { ApiResponseProperty } from "@nestjs/swagger";

export class SubCategoryResponseDto {
    @ApiResponseProperty({
        example: 1
    })
    public id:number 

    @ApiResponseProperty({
        example: "phone"
    })
    public name:string

    @ApiResponseProperty({
        example: "1000000000000"
    })
    public createdAt:Date 

    @ApiResponseProperty({
        example: "0000000000000"
    })
    public updatedAt:Date 

    @ApiResponseProperty({
        example: "FALSE"
    })
    public isDeleted:string 
}

export class CategoryResponseDto {
    @ApiResponseProperty({
        example: 1
    })
    public id:number 

    @ApiResponseProperty({
        example: "phone"
    })
    public name:string

    @ApiResponseProperty({
        example: "1000000000000"
    })
    public createdAt:Date 

    @ApiResponseProperty({
        example: "0000000000000"
    })
    public updatedAt:Date 

    @ApiResponseProperty({
        example: "FALSE"
    })
    public isDeleted:string 

    @ApiResponseProperty({
        type: [SubCategoryResponseDto]
    })
    subCategories: SubCategoryResponseDto[]
}


