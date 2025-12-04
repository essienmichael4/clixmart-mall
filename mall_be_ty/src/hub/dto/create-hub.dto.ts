import { IsString, IsNumber, IsOptional, IsArray } from "class-validator";

export class CreateHubDto {
  @IsString()
  name: string;

  @IsNumber()
  regionId: number;

  @IsOptional()
  @IsNumber()
  mmdaId?: number;

  @IsOptional()
  @IsNumber()
  townId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  types?: string[];
}
