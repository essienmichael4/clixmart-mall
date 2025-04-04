import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class PageOptionsDto {
    @ApiPropertyOptional({
        minimum: 1,
        default: 1
    })
    @Type(()=> Number)
    @IsInt()
    @Min(1)
    @IsOptional()
    readonly page?: number = 1

    @ApiPropertyOptional({
        minimum: 1,
        maximum: 100,
        default: 50
    })
    @Type(()=> Number)
    @IsInt()
    @Min(1)
    @Max(100)
    @IsOptional()
    readonly take?: number = 50

    get skip(): number{
        return (this.page - 1) * this.take
    }
}
