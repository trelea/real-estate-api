import { Column } from 'typeorm';
import { GlobalEntityIncrement } from './_';
import { ILanguages } from './langs.interface';

export class GlobalEntityWithLanguages
  extends GlobalEntityIncrement
  implements ILanguages
{
  @Column({ type: 'varchar', nullable: false })
  ro: string;

  @Column({ type: 'varchar', nullable: false })
  ru: string;

  @Column({ type: 'varchar', nullable: false })
  en: string;
}
