import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { GlobalEntityIncrement } from './_';
import { User } from './user';
import { Location } from './location';
import { GarageFeature } from './garage-feature';
import { Media } from './media';

export enum GarageOffert {
  SALE = 'SALE',
  RENT = 'RENT',
}

export enum GarageStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Entity()
export class Garage extends GlobalEntityIncrement {
  @Column({ type: 'simple-array', nullable: false })
  offert: GarageOffert[];

  @ManyToOne(() => User, (user) => user.garages, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: User;

  @Column({ type: 'decimal', nullable: false })
  price: number;

  @Column({ type: 'boolean', nullable: true, default: false })
  hot: boolean;

  @Column({ type: 'enum', enum: GarageStatus, default: GarageStatus.PRIVATE })
  status: GarageStatus;

  @Column({ type: 'text', nullable: true })
  desc_ro: string;
  @Column({ type: 'text', nullable: true })
  desc_ru: string;
  @Column({ type: 'text', nullable: true })
  desc_en: string;

  /** location */
  @OneToOne(() => Location, (loc) => loc.garage, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  location: Location;

  /** characteristics */
  @Column({ type: 'int', unsigned: true, nullable: false })
  area: number;

  @ManyToMany(() => GarageFeature, (f) => f.garages)
  @JoinTable()
  features: GarageFeature[];

  /** media */
  @OneToMany(() => Media, (media) => media.garage, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  media: Media[];

  @Column({ type: 'int', nullable: true, default: 1 })
  views: number;
}
