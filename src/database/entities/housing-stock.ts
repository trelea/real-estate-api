import { Entity, OneToMany, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { Apartment } from './apartment';
import { House } from './house';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class HousingStock extends MultilingualEntity {
  @OneToMany(() => Apartment, (apartment) => apartment.housing_stock)
  apartments: Apartment[];

  @OneToMany(() => House, (house) => house.housing_stock)
  houses: House[];
}
