import { PartialType } from '@nestjs/mapped-types';
import { CreateGarageDto } from './create-garage.dto';

export class UpdateGarageDto extends PartialType(CreateGarageDto) {}
