import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class ItemDto{
    @ApiProperty({
        description: "product id",
        example: "edded-ehdyt-dsddd-123ed",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    id:string 

    @ApiProperty({
        description: "quantity",
        example: 15,
        required: true
    })
    @IsDefined()
    @IsNumber()
    quantity:number 
}

export class CreateOrderDto {
    @ApiProperty({
        type: [ItemDto],
        isArray: true,
        description: "order items",
        example: [{id: "edded-ehdyt-dsddd-123ed", quantity: 15}],
        required: true
    })
    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>ItemDto)
    items:ItemDto[]

    @ApiProperty({
        description: "Address id",
        example: "edded-ehdyt-dsddd-123ed",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    addressId:string 
}
