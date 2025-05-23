import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { GlobalEntityUUID } from './_';
import { BlogContent } from './blog-content';

export enum BlogStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Entity()
export class Blog extends GlobalEntityUUID {
  @Column({ type: 'varchar', nullable: true })
  thumbnail: string | null;

  @Column({ type: 'enum', enum: BlogStatus, default: BlogStatus.PRIVATE })
  status: BlogStatus;

  @Column({ type: 'int', nullable: true, default: 1 })
  views: number;

  @OneToOne(() => BlogContent, (blogContent) => blogContent.blog, {
    onDelete: 'SET NULL',
  })
  @JoinColumn()
  content: BlogContent;
}
