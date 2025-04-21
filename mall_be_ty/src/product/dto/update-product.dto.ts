import { ApiProperty, PartialType } from '@nestjs/swagger';
import { ProductDetailsDto } from './create-product.dto';
import { IsEnum } from 'class-validator';
import { Status } from '../entities/product.entity';
import { ReviewStatus } from '../entities/review.entity';

export class UpdateProductDto extends PartialType(ProductDetailsDto) {}

export class UpdateProductStatusDto {
    @ApiProperty({
        description: "product status",
        example: "DRAFT",
        required: true
    })
    @IsEnum(Status)
    status:Status
}

export class UpdateProductReviewStatusDto {
    @ApiProperty({
        description: "product approval review status",
        example: "PENDING",
        required: true
    })
    @IsEnum(ReviewStatus)
    status:ReviewStatus
}
