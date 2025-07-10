import { IsOptional, IsString } from 'class-validator';

export class UpdateMultilingualDto {
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
