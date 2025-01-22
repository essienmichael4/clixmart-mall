import { ApiResponseProperty } from "@nestjs/swagger";

export class UserResponseDto {
    @ApiResponseProperty({
        example: 1
    })
    public id:number 

    @ApiResponseProperty({
        example: "John Doe"
    })
    public name:string

    @ApiResponseProperty({
        example: "test@example.com"
    })
    public email:string

    @ApiResponseProperty({
        example: "1000000000000"
    })
    public createdAt:Date 

    @ApiResponseProperty({
        example: "0000000000000"
    })
    public updatedAt:Date 

    @ApiResponseProperty({
        example: "USER"
    })
    public role:string 



}
