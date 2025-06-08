import { IsOptional, IsUUID } from 'class-validator';

export class PatchServiceLandingDto {
  @IsOptional()
  @IsUUID()
  service: string;
}
