import { Entity, ManyToMany, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { House } from './house';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class HouseFeature extends MultilingualEntity {
  @ManyToMany(() => House, (house) => house.features)
  houses: House[];
}
