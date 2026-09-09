import { Entity, ManyToMany, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { Garage } from './garage';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class GarageFeature extends MultilingualEntity {
  @ManyToMany(() => Garage, (garage) => garage.features)
  garages: Garage[];
}
