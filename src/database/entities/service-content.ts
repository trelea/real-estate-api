import { Column, Entity, OneToOne } from 'typeorm';
import { GlobalEntity } from './_';
import { Service } from './service';

@Entity()
export class ServiceContent extends GlobalEntity {
  @Column({ type: 'varchar', nullable: false })
  title_ro: string;

  @Column({ type: 'varchar', nullable: false })
  title_ru: string;

  @Column({ type: 'varchar', nullable: false })
  title_en: string;

  @Column({ type: 'text', nullable: false })
  desc_ro: string;

  @Column({ type: 'text', nullable: false })
  desc_ru: string;

  @Column({ type: 'text', nullable: false })
  desc_en: string;

  @OneToOne(() => Service, (service) => service.content, {
    onDelete: 'SET NULL',
  })
  service: Service;
}
