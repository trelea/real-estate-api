import { IsOptional, IsString } from 'class-validator';

export class PatchTermsAndConditionsDto {
  @IsString()
  @IsOptional()
  content_ro?: string;

  @IsString()
  @IsOptional()
  content_ru?: string;

  @IsString()
  @IsOptional()
  content_en?: string;
}
