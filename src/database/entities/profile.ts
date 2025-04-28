import { Column, Entity, OneToOne, Unique } from 'typeorm';
import { GlobalEntity } from './_';
import { User } from './user';

@Entity()
@Unique(['name', 'surname'])
export class Profile extends GlobalEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  surname: string;

  @Column({ type: 'varchar', nullable: true })
  contact: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnail: string;

  /**
   * relation to user 1 <-> 1
   */
  @OneToOne(() => User, (user) => user.profile)
  user: User;
}
