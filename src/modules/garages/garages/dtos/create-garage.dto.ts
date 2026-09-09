import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { GarageOffert, GarageStatus } from 'src/database/entities/garage';

export class CreateGarageDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(GarageOffert, { each: true })
  offert: GarageOffert[];

  @IsUUID()
  @IsNotEmpty()
  user: string;

  @IsString()
  @IsNotEmpty()
  desc_ro: string;

  @IsString()
  @IsNotEmpty()
  desc_ru: string;

  @IsString()
  @IsNotEmpty()
  desc_en: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsBoolean()
  @IsOptional()
  hot?: boolean;

  @IsEnum(GarageStatus)
  @IsOptional()
  status?: GarageStatus;

  /** location */
  @IsNumber()
  @IsNotEmpty()
  location_category: number;

  @IsNumber()
  @IsNotEmpty()
  location_subcategory: number;

  @IsString()
  @IsNotEmpty()
  street_ro: string;

  @IsString()
  @IsNotEmpty()
  street_ru: string;

  @IsString()
  @IsNotEmpty()
  street_en: string;

  @IsNumber()
  @IsNotEmpty()
  lat: number;

  @IsNumber()
  @IsNotEmpty()
  lng: number;

  /** characteristics */
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  area: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  features?: number[];
}
