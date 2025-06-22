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
import { TerrainOffert, TerrainStatus } from 'src/database/entities/terrain';

export class CreateTerrainDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(TerrainOffert, { each: true })
  offert: TerrainOffert[];

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

  @IsEnum(TerrainStatus)
  @IsOptional()
  status?: TerrainStatus;

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
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  usability: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  features?: number[];
}
