import { Module } from '@nestjs/common';
import { TerrainsFeaturesController } from './terrains-features.controller';
import { TerrainsFeaturesService } from './terrains-features.service';
import { DatabaseModule } from 'src/database';
import { TerrainFeature } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([TerrainFeature])],
  controllers: [TerrainsFeaturesController],
  providers: [TerrainsFeaturesService],
})
export class TerrainsFeaturesModule {}
