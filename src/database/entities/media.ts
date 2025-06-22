import { Column, Entity, ManyToOne } from 'typeorm';
import { GlobalEntityUUID } from './_';
import { Apartment } from './apartment';
import { House } from './house';
import { Commercial } from './commercial';
import { Terrain } from './terrain';

@Entity()
export class Media extends GlobalEntityUUID {
  @Column({ type: 'varchar', nullable: false })
  url: string;

  /**
   * relations
   */
  @ManyToOne(() => Apartment, (apartment) => apartment.media, {
    onDelete: 'CASCADE',
  })
  apartment: Apartment;

  @ManyToOne(() => House, (house) => house.media, {
    onDelete: 'CASCADE',
  })
  house: House;

  @ManyToOne(() => Commercial, (commercial) => commercial.media, {
    onDelete: 'CASCADE',
  })
  commercial: Commercial;

  @ManyToOne(() => Terrain, (terrain) => terrain.media, {
    onDelete: 'CASCADE',
  })
  terrain: Terrain;
}
