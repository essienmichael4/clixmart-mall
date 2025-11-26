import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class FindDepartmentUserDto {
    @ApiProperty({
        description: "name",
        example: "John Doe",
        required: false
    })
    @IsString()
    @IsOptional()
    name?:string 
}
