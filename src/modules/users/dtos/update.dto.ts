import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/database/entities';
import { IsMdPhoneNumber } from 'src/shared/decorators';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsString()
  @IsOptional()
  job_function?: string;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsOptional()
  @IsMdPhoneNumber()
  contact?: string;

  /**
   * socials contacts
   */
  @IsUrl()
  @IsOptional()
  telegram?: string;

  @IsPhoneNumber()
  @IsOptional()
  whatsapp?: string;

  @IsPhoneNumber()
  @IsOptional()
  viber?: string;
}
