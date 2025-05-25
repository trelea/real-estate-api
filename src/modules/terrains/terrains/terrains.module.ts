import { Module } from '@nestjs/common';
import { TerrainsController } from './terrains.controller';
import { TerrainsService } from './terrains.service';

@Module({
  controllers: [TerrainsController],
  providers: [TerrainsService]
})
export class TerrainsModule {}
