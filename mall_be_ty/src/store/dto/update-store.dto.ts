import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateStoreDto } from './create-store.dto';
import { IsDefined, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../entities/storeReview.entity';

export class UpdateStoreDto extends PartialType(CreateStoreDto) {}

export class UpdateStoreReviewDto {
    @ApiProperty({
        description: "Review status",
        example: "PENDING",
        required: true
    })
    @IsEnum(Status)
    status:Status

    @ApiProperty({
        description: "State or region name",
        example: "Greater Accra",
        required: false
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description:string 
}
