import { Column, Entity, OneToOne } from 'typeorm';
import { GlobalEntity } from './_';
import { Blog } from './blog';

@Entity()
export class BlogContent extends GlobalEntity {
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

  @OneToOne(() => Blog, (blog) => blog.content, { onDelete: 'SET NULL' })
  blog: Blog;
}
