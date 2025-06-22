import { PartialType } from '@nestjs/mapped-types';
import { CreateTerrainDto } from './create-terrain.dto';

export class UpdateTerrainDto extends PartialType(CreateTerrainDto) {}
