import { Entity, OneToMany, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { Apartment } from './apartment';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class HousingStock extends MultilingualEntity {
  @OneToMany(() => Apartment, (apartment) => apartment.stock)
  apartments: Apartment[];
}
