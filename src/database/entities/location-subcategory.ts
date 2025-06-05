import { Entity, ManyToOne, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { LocationCategory } from './location-category';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class LocationSubcategory extends MultilingualEntity {
  @ManyToOne(() => LocationCategory, (category) => category.subcategories)
  category: LocationCategory;
}
