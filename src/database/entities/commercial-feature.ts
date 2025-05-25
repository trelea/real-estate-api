import { Entity, Unique } from 'typeorm';
import { MultilingualEntity } from './multilingual';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class CommercialFeature extends MultilingualEntity {}
