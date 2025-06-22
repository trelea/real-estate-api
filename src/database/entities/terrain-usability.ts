import { Entity, ManyToMany, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { Terrain } from './terrain';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class TerrainUsability extends MultilingualEntity {
  @ManyToMany(() => Terrain, (terrain) => terrain.usability)
  terrains: Terrain[];
}
