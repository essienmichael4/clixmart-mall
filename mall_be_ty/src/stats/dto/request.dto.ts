import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export enum TimeFrame {
    MONTH = 'MONTH',
    YEAR = 'YEAR',
}

export class StatsHistoryDto {
    @ApiProperty({
        description: "Timeframe",
        example: "MONTH",
        required: true
    })
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    timeframe:TimeFrame

    @ApiProperty({
        description: "month",
        example: 1,
        required: true
    })
    @IsDefined()
    @IsNumber()
    month:number 

    @ApiProperty({
        description: "price",
        example: 1,
        required: true
    })
    @IsDefined()
    @IsNumber()
    year:number 
}

export class StatiticsRequestDto {
    @ApiProperty({
        description: "From date",
        example: 1,
        required: false
    })
    @IsString()
    @IsOptional()
    from:string 

    @ApiProperty({
        description: "To date",
        example: 1,
        required: false
    })
    @IsString()
    @IsOptional()
    to:string 
}
