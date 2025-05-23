import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { GlobalEntityUUID } from './_';
import { ServiceContent } from './service-content';

export enum ServiceStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Entity()
export class Service extends GlobalEntityUUID {
  @Column({ type: 'varchar', nullable: true })
  thumbnail: string | null;

  @Column({ type: 'enum', enum: ServiceStatus, default: ServiceStatus.PRIVATE })
  status: ServiceStatus;

  @Column({ type: 'int', nullable: true, default: 1 })
  views: number;

  @OneToOne(() => ServiceContent, (blogContent) => blogContent.service, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  content: ServiceContent;
}
