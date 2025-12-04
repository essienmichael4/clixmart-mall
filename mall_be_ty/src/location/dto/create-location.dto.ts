import { IsString, IsOptional, Length, IsEnum, IsNumber, MaxLength } from "class-validator";
import { MmdaType } from "src/hub/entities/metropolitan.entity";

export class CreateRegionDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  capital: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  code?: string;
}

export class CreateMmdaDto {
  @IsString()
  name: string;

  @IsEnum(MmdaType)
  type: MmdaType;

  @IsNumber()
  regionId: number;

  @IsOptional()
  @IsString()
  capital?: string;

  @IsOptional()
  @IsString()
  @Length(1, 10)
  code?: string;
}

export class CreateTownDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(120)
  landmark?: string;

  @IsString()
  @IsOptional()
  @MaxLength(10)
  postcode?: string;

  // ✅ This links Town → MMDA
  @IsNumber()
  mmdaId: number;
}
