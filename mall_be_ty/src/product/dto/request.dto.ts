import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsOptional, IsString } from "class-validator"
import { Status } from "../entities/product.entity"
import { ReviewStatus } from "../entities/review.entity"

export class ProductFilterDto {
    @ApiProperty({
            description: "Status",
            example: Status.DRAFT,
            required: false
        })
    @IsEnum(Status)
    @IsOptional()
    status?:Status

    @ApiProperty({
        description: "Review status",
        example: ReviewStatus.PENDING,
        required: false
    })
    @IsEnum(ReviewStatus)
    @IsOptional()
    review?:ReviewStatus 
}
