import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateUserCarouselDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  priority?: number;
}
