import { ApiProperty } from "@nestjs/swagger"
import { IsDefined, IsString, IsNotEmpty, IsNumber } from "class-validator"

export class TaxDto {
    @ApiProperty({
        description: "Tax rate",
        example: 10,
        required: true
    })
    @IsDefined()
    @IsNumber()
    taxPercent:number 
}
