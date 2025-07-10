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
import { ApartmentOffert, ApartmentStatus } from 'src/database/entities';

export class CreateApartmentDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(ApartmentOffert, { each: true })
  offert: ApartmentOffert[];

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

  @IsEnum(ApartmentStatus)
  @IsOptional()
  status?: ApartmentStatus;

  /**
   * location
   */
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

  /**
   * caracteristics
   */
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  rooms: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  sanitaries: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  surface: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  floor: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  floors: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  housing_stock: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  housing_conditions: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  features?: number[];
}
