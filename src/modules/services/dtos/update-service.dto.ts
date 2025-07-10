import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ServiceStatus } from 'src/database/entities';

export class UpdateServiceDto {
  @IsOptional()
  @IsString()
  title_en?: string;

  @IsOptional()
  @IsString()
  title_ro?: string;

  @IsOptional()
  @IsString()
  title_ru?: string;

  @IsOptional()
  @IsString()
  desc_en?: string;

  @IsOptional()
  @IsString()
  desc_ro?: string;

  @IsOptional()
  @IsString()
  desc_ru?: string;

  @IsOptional()
  @IsString()
  content_en?: string;

  @IsOptional()
  @IsString()
  content_ro?: string;

  @IsOptional()
  @IsString()
  content_ru?: string;

  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;
}
