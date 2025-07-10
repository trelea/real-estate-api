import { Entity, ManyToMany, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { Apartment } from './apartment';
import { House } from './house';
import { Commercial } from './commercial';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class HousingCondition extends MultilingualEntity {
  @ManyToMany(() => Apartment, (apartment) => apartment.housing_conditions)
  apartments: Apartment[];

  @ManyToMany(() => House, (house) => house.housing_conditions)
  houses: House[];

  @ManyToMany(() => Commercial, (commercial) => commercial.housing_conditions)
  commercials: Commercial[];
}
