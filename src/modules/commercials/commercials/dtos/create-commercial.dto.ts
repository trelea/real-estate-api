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
import {
  CommercialOffert,
  CommercialStatus,
} from 'src/database/entities/commercial';

export class CreateCommercialDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(CommercialOffert, { each: true })
  offert: CommercialOffert[];

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

  @IsNumber()
  @IsOptional()
  price_square?: number;

  @IsBoolean()
  @IsOptional()
  hot?: boolean;

  @IsEnum(CommercialStatus)
  @IsOptional()
  status?: CommercialStatus;

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
  floors: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  area: number;

  @IsBoolean()
  @IsOptional()
  first_line?: boolean;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  housing_conditions: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  commercial_destinations: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  commercial_placings: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  features?: number[];
}
