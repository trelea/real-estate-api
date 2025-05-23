import { Entity, Unique } from 'typeorm';
import { GlobalEntityWithLanguages } from './__';

@Entity()
@Unique(['ro', 'ru', 'en'])
export class HousingCondition extends GlobalEntityWithLanguages {}
