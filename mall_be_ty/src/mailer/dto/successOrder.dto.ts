import { ApiProperty } from "@nestjs/swagger";
import { IsDefined } from "class-validator";
import { Order } from "src/order/entities/order.entity";

export class SuccessfulOrderEventDto {
    @ApiProperty({
        description: "email",
        example: "John Doe",
        required: true
    })
    @IsDefined()
    order:Order
}
