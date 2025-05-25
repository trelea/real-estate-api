import { Module } from '@nestjs/common';
import { TerrainsUsabilitiesController } from './terrains-usabilities.controller';
import { TerrainsUsabilitiesService } from './terrains-usabilities.service';
import { DatabaseModule } from 'src/database';
import { TerrainUsability } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([TerrainUsability])],
  controllers: [TerrainsUsabilitiesController],
  providers: [TerrainsUsabilitiesService],
})
export class TerrainsUsabilitiesModule {}
