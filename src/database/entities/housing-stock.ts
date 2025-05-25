import { Entity, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class HousingStock extends MultilingualEntity {}
