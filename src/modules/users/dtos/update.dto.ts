import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/database/entities';
import { IsMdPhoneNumber } from 'src/shared/decorators';

export class UpdateUserDto {
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsOptional()
  @IsMdPhoneNumber()
  contact?: string;
}
