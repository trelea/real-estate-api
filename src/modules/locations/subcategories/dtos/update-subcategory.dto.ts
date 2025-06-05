import { IsNumber, IsOptional } from 'class-validator';
import { UpdateMultilingualDto } from 'src/services/multilingual/dtos';

export class UpdateLocationSubCategoryDto extends UpdateMultilingualDto {
  @IsNumber()
  @IsOptional()
  category: number;
}
