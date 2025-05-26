import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BlogStatus } from 'src/database/entities';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title_ro: string;

  @IsString()
  @IsNotEmpty()
  title_ru: string;

  @IsString()
  @IsNotEmpty()
  title_en: string;

  @IsString()
  @IsNotEmpty()
  desc_ru: string;

  @IsString()
  @IsNotEmpty()
  desc_en: string;

  @IsString()
  @IsNotEmpty()
  desc_ro: string;

  @IsString()
  @IsNotEmpty()
  content_ru: string;

  @IsString()
  @IsNotEmpty()
  content_en: string;

  @IsString()
  @IsNotEmpty()
  content_ro: string;

  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;
}
