import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsString } from "class-validator";
import { Order } from "src/order/entities/order.entity";

export class SuccessfulOrderEventDto {
    @ApiProperty({
        description: "email",
        example: "John Doe",
        required: true
    })
    @IsDefined()
    @IsString()
    order:Order
}
