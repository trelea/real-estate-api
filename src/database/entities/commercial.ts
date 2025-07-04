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
import { HousingCondition } from './housing-condition';
import { CommercialFeature } from './commercial-feature';
import { CommercialDestination } from './commercial-destination';
import { CommercialPlacing } from './commercial-placing';
import { Media } from './media';

export enum CommercialOffert {
  SALE = 'SALE',
  RENT = 'RENT',
}

export enum CommercialStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Entity()
export class Commercial extends GlobalEntityIncrement {
  @Column({ type: 'simple-array', nullable: false })
  offert: CommercialOffert[];

  @ManyToOne(() => User, (user) => user.commercials, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: User;

  @Column({ type: 'decimal', nullable: false })
  price: number;

  @Column({ type: 'decimal', nullable: true, default: 1 })
  price_square: number;

  @Column({ type: 'boolean', nullable: true, default: false })
  hot: boolean;

  @Column({
    type: 'enum',
    enum: CommercialStatus,
    default: CommercialStatus.PRIVATE,
  })
  status: CommercialStatus;

  @Column({ type: 'text', nullable: true })
  desc_ro: string;
  @Column({ type: 'text', nullable: true })
  desc_ru: string;
  @Column({ type: 'text', nullable: true })
  desc_en: string;

  /** location */
  @OneToOne(() => Location, (location) => location.commercial, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  location: Location;

  /** characteristics */
  @Column({ type: 'int', unsigned: true, nullable: false })
  floors: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  area: number;

  @Column({ type: 'boolean', nullable: true, default: false })
  first_line: boolean;

  /** relations */
  @ManyToMany(() => HousingCondition, (condition) => condition.commercials)
  @JoinTable()
  housing_conditions: HousingCondition[];

  @ManyToMany(() => CommercialDestination, (dest) => dest.commercials)
  @JoinTable()
  commercial_destinations: CommercialDestination[];

  @ManyToMany(() => CommercialPlacing, (placing) => placing.commercials)
  @JoinTable()
  commercial_placings: CommercialPlacing[];

  @ManyToMany(() => CommercialFeature, (feature) => feature.commercials)
  @JoinTable()
  features: CommercialFeature[];

  /** media */
  @OneToMany(() => Media, (media) => media.commercial, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  media: Media[];

  @Column({ type: 'int', nullable: true, default: 1 })
  views: number;
}
