import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { OrderStatus } from "../entities/order.entity"

export class OrderFilterDto {
    @ApiProperty({
            description: "Status",
            example: OrderStatus.PENDING,
            required: false
        })
    @IsEnum(OrderStatus)
    @IsOptional()
    status?:OrderStatus
}
