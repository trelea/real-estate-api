import { Entity, ManyToMany, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { Commercial } from './commercial';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class CommercialDestination extends MultilingualEntity {
  @ManyToMany(
    () => Commercial,
    (commercial) => commercial.commercial_destinations,
  )
  commercials: Commercial[];
}
