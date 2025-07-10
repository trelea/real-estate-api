import { Entity, OneToMany, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { LocationSubcategory } from './location-subcategory';
import { Location } from './location';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class LocationCategory extends MultilingualEntity {
  @OneToMany(() => LocationSubcategory, (subcategory) => subcategory.category)
  subcategories: LocationSubcategory[];

  @OneToMany(() => Location, (location) => location.location_category)
  location: Location[];
}
