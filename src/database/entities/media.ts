import { Column, Entity, ManyToMany } from 'typeorm';
import { GlobalEntityUUID } from './_';
import { Apartment } from './apartment';

@Entity()
export class Media extends GlobalEntityUUID {
  @Column({ type: 'varchar', nullable: false })
  url: string;

  /**
   * relations
   */
  @ManyToMany(() => Apartment, (apartment) => apartment.media)
  apartments: Apartment[];
}
