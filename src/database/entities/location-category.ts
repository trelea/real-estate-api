import { Entity, OneToMany, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { LocationSubcategory } from './location-subcategory';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class LocationCategory extends MultilingualEntity {
  @OneToMany(() => LocationSubcategory, (subcategory) => subcategory.category)
  subcategories: LocationSubcategory[];
}
