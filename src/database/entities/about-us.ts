import { Column, Entity } from 'typeorm';
import { GlobalEntityUUID } from './_';

@Entity()
export class AboutUs extends GlobalEntityUUID {
  @Column({ type: 'text', nullable: true, default: 'Despre Noi' })
  content_ro: string;

  @Column({ type: 'text', nullable: true, default: 'О нас' })
  content_ru: string;

  @Column({ type: 'text', nullable: true, default: 'About Us' })
  content_en: string;
}
