import { Column, Entity, JoinColumn, OneToOne, Unique } from 'typeorm';
import { GlobalEntityUUID } from './_';
import { User } from './user';

@Entity()
@Unique(['user'])
export class UserCarousel extends GlobalEntityUUID {
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @Column({ type: 'integer', nullable: true, default: 1 })
  priority: number;
}
