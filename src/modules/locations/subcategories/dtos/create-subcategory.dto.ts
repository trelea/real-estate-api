import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateMultilingualDto } from 'src/services/multilingual/dtos';

export class CreateLocationSubCategoryDto extends CreateMultilingualDto {
  @IsNumber()
  @IsNotEmpty()
  category: number;
}
