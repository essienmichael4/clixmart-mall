import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { Status } from "../entities/order.entity"

export class OrderFilterDto {
    @ApiProperty({
            description: "Status",
            example: Status.PENDING,
            required: false
        })
    @IsEnum(Status)
    @IsOptional()
    status?:Status
}
