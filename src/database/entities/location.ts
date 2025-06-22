import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { GlobalEntityUUID } from './_';
import { LocationCategory } from './location-category';
import { LocationSubcategory } from './location-subcategory';
import { Apartment } from './apartment';
import { House } from './house';
import { Commercial } from './commercial';
import { Terrain } from './terrain';

@Entity()
export class Location extends GlobalEntityUUID {
  @ManyToOne(
    () => LocationCategory,
    (location_category) => location_category.location,
    { nullable: true, onDelete: 'SET NULL' },
  )
  location_category: LocationCategory;
  @ManyToOne(
    () => LocationSubcategory,
    (location_subcategory) => location_subcategory.location,
    { nullable: true, onDelete: 'SET NULL' },
  )
  location_subcategory: LocationSubcategory;

  @Column({ type: 'varchar', nullable: false })
  street_ro: string;
  @Column({ type: 'varchar', nullable: false })
  street_ru: string;
  @Column({ type: 'varchar', nullable: false })
  street_en: string;
  @Column({ type: 'decimal', nullable: false })
  lat: number;
  @Column({ type: 'decimal', nullable: false })
  lng: number;

  @OneToOne(() => Apartment, (apartment) => apartment.location, {
    onDelete: 'CASCADE',
  })
  apartment: Apartment;

  @OneToOne(() => House, (house) => house.location, {
    onDelete: 'CASCADE',
  })
  house: House;

  @OneToOne(() => Commercial, (commercial) => commercial.location, {
    onDelete: 'CASCADE',
  })
  commercial: Commercial;

  @OneToOne(() => Terrain, (terrain) => terrain.location, {
    onDelete: 'CASCADE',
  })
  terrain: Terrain;
}
