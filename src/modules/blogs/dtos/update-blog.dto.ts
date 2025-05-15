import { IsEnum, IsOptional, IsString } from 'class-validator';
import { BlogStatus } from 'src/database/entities';

export class UpdateBlogDto {
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
  @IsEnum(BlogStatus)
  status?: BlogStatus;
}
