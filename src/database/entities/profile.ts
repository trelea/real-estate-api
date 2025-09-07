import { Column, Entity, OneToOne, Unique } from 'typeorm';
import { GlobalEntityUUID } from './_';
import { User } from './user';

@Entity()
@Unique(['name', 'surname'])
export class Profile extends GlobalEntityUUID {
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  surname: string;

  @Column({ type: 'varchar', nullable: true })
  contact: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnail: string;

  @Column({ type: 'varchar', nullable: true })
  job_function: string;

  /**
   * socials contacts
   */
  @Column({ type: 'varchar', nullable: true })
  telegram: string;

  @Column({ type: 'varchar', nullable: true })
  whatsapp: string;

  @Column({ type: 'varchar', nullable: true })
  viber: string;

  /**
   * relation to user 1 <-> 1
   */
  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  user: User;
}
