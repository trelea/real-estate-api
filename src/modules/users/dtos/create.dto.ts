import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { SigninDto } from 'src/core/auth/dtos';
import { UserRole } from 'src/database/entities';
import { IsMdPhoneNumber } from 'src/shared/decorators';

export class CreateUserDto extends SigninDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;

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
