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
  Min,
} from 'class-validator';
import { HouseOffert, HouseStatus } from 'src/database/entities';

export class CreateHouseDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(HouseOffert, { each: true })
  offert: HouseOffert[];

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

  @IsEnum(HouseStatus)
  @IsOptional()
  status?: HouseStatus;

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
   * characteristics
   */
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  floors: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  rooms: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  bathrooms: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  area: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  balcony?: number;

  /**
   * housing
   */
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
