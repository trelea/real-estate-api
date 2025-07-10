import { Entity, ManyToMany, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { Apartment } from './apartment';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class ApartmentFeature extends MultilingualEntity {
  @ManyToMany(() => Apartment, (apartment) => apartment.features)
  apartments: Apartment[];
}
