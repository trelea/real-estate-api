import { Column, Entity } from 'typeorm';
import { GlobalEntityUUID } from './_';

@Entity()
export class PrivacyPolicy extends GlobalEntityUUID {
  @Column({
    type: 'text',
    nullable: true,
    default: 'Politica de Confidențialitate',
  })
  content_ro: string;

  @Column({
    type: 'text',
    nullable: true,
    default: 'Политика конфиденциальности',
  })
  content_ru: string;

  @Column({ type: 'text', nullable: true, default: 'Privacy Policy' })
  content_en: string;
}
