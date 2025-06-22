import { Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { LocationCategory } from './location-category';
import { Location } from './location';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class LocationSubcategory extends MultilingualEntity {
  @ManyToOne(() => LocationCategory, (category) => category.subcategories, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: LocationCategory;

  @OneToMany(() => Location, (location) => location.location_subcategory)
  location: Location[];
}
