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
import { HousingStock } from './housing-stock';
import { HousingCondition } from './housing-condition';
import { ApartmentFeature } from './apartment-feature';
import { Media } from './media';
import { Location } from './location';

export enum ApartmentOffert {
  SALE = 'SALE',
  RENT = 'RENT',
}

export enum ApartmentStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Entity()
export class Apartment extends GlobalEntityIncrement {
  @Column({ type: 'simple-array', nullable: false })
  offert: ApartmentOffert[];

  @ManyToOne(() => User, (user) => user.apartments, {
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
    enum: ApartmentStatus,
    nullable: true,
    default: ApartmentStatus.PRIVATE,
  })
  status: ApartmentStatus;

  @Column({ type: 'text', nullable: true })
  desc_ro: string;
  @Column({ type: 'text', nullable: true })
  desc_ru: string;
  @Column({ type: 'text', nullable: true })
  desc_en: string;

  @OneToOne(() => Location, (location) => location.apartment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  location: Location;

  @Column({ type: 'int', unsigned: true, nullable: false })
  rooms: number;
  @Column({ type: 'int', unsigned: true, nullable: false })
  sanitaries: number;
  @Column({ type: 'int', unsigned: true, nullable: false })
  surface: number;
  @Column({ type: 'int', unsigned: true, nullable: false })
  floor: number;
  @Column({ type: 'int', unsigned: true, nullable: false })
  floors: number;

  @ManyToOne(() => HousingStock, (housing_stock) => housing_stock.apartments, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  housing_stock: HousingStock;
  @ManyToMany(
    () => HousingCondition,
    (housing_conditions) => housing_conditions.apartments,
  )
  @JoinTable()
  housing_conditions: HousingCondition[];
  @ManyToMany(() => ApartmentFeature, (feature) => feature.apartments)
  @JoinTable()
  features: ApartmentFeature[];

  /**
   * media
   */
  @OneToMany(() => Media, (media) => media.apartment, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  media: Media[];

  /**
   * IDK
   */
  @Column({ type: 'int', nullable: true, default: 1 })
  views: number;
}
