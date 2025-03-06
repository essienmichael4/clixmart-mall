import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDefined, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class ItemDto{
    @ApiProperty({
        description: "product id",
        example: 15,
        required: true
    })
    @IsDefined()
    @IsNumber()
    id:number 

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
        example: [{id: 2, quantity: 15}],
        required: true
    })
    @IsArray()
    @ValidateNested({each: true})
    @Type(()=>ItemDto)
    items:ItemDto[]
}
