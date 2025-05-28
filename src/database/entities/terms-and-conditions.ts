import { Column, Entity } from 'typeorm';
import { GlobalEntityUUID } from './_';

@Entity()
export class TermsAnsConditions extends GlobalEntityUUID {
  @Column({ type: 'text', nullable: true, default: 'Termeni și Condiții' })
  content_ro: string;

  @Column({ type: 'text', nullable: true, default: 'Условия и положения' })
  content_ru: string;

  @Column({ type: 'text', nullable: true, default: 'Terms and Conditions' })
  content_en: string;
}
