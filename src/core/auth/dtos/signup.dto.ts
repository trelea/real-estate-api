import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';
import { SigninDto } from './signin.dto';
import { UserRole } from 'src/database/entities';
import { IsMdPhoneNumber } from 'src/shared/decorators';

export class SignupDto extends SigninDto {
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

  @IsUrl()
  @IsOptional()
  whatsapp?: string;

  @IsUrl()
  @IsOptional()
  viber?: string;
}
