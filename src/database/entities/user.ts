import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { GlobalEntityUUID } from './_';
import { Profile } from './profile';
import { Apartment } from './apartment';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum UserPriority {
  HIGH = 'HIGH',
  LOW = 'LOW',
}

@Entity()
export class User extends GlobalEntityUUID {
  @Column({ type: 'varchar', nullable: false, unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserPriority,
    default: UserPriority.LOW,
    nullable: true,
  })
  priority: UserPriority;

  /**
   * relation to profile 1 <-> 1
   */
  @OneToOne(() => Profile, (profile) => profile.user, { onDelete: 'CASCADE' })
  @JoinColumn()
  profile: Profile;

  /**
   * apartments one -> many
   */
  @OneToMany(() => Apartment, (apartment) => apartment.user)
  apartments: Apartment[];
}
