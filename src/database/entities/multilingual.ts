import { Column } from 'typeorm';
import { GlobalEntityIncrement } from './_';

export interface IMultilingual {
  ro: string;
  ru: string;
  en: string;
}

export class MultilingualEntity
  extends GlobalEntityIncrement
  implements IMultilingual
{
  @Column({ type: 'varchar', nullable: false, unique: true })
  ro: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  ru: string;

  @Column({ type: 'varchar', nullable: false, unique: true })
  en: string;
}
