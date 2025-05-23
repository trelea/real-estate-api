import { IsNotEmpty, IsString } from 'class-validator';

export class CreateHousingConditionDto {
  @IsNotEmpty()
  @IsString()
  ro: string;

  @IsNotEmpty()
  @IsString()
  ru: string;

  @IsNotEmpty()
  @IsString()
  en: string;
}
