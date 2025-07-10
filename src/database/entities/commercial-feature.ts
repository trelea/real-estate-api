import { Entity, ManyToMany, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';
import { Commercial } from './commercial';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class CommercialFeature extends MultilingualEntity {
  @ManyToMany(() => Commercial, (commercial) => commercial.features)
  commercials: Commercial[];
}
