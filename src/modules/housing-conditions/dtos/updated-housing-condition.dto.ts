import { IsOptional, IsString } from 'class-validator';

export class UpdateHousingConditionDto {
  @IsOptional()
  @IsString()
  ro: string;

  @IsOptional()
  @IsString()
  ru: string;

  @IsOptional()
  @IsString()
  en: string;
}
