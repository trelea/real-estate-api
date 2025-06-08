import { IsUUID, IsInt, Min, IsOptional } from 'class-validator';

export class CreateUserCarouselDto {
  @IsUUID()
  user: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  priority?: number;
}
