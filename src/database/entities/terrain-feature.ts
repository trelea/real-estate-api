import { Entity, ManyToMany, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { Terrain } from './terrain';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class TerrainFeature extends MultilingualEntity {
  @ManyToMany(() => Terrain, (terrain) => terrain.features)
  terrains: Terrain[];
}
