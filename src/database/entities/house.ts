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
import { HouseFeature } from './house-feature';
import { Media } from './media';
import { Location } from './location';

export enum HouseOffert {
  SALE = 'SALE',
  RENT = 'RENT',
}

export enum HouseStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Entity()
export class House extends GlobalEntityIncrement {
  /**
   * basic info
   */
  @Column({ type: 'simple-array', nullable: false })
  offert: HouseOffert[];

  @ManyToOne(() => User, (user) => user.houses, {
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
    enum: HouseStatus,
    nullable: true,
    default: HouseStatus.PRIVATE,
  })
  status: HouseStatus;

  /**
   * descriptions (multilingual)
   */
  @Column({ type: 'text', nullable: false })
  desc_ro: string;
  @Column({ type: 'text', nullable: false })
  desc_ru: string;
  @Column({ type: 'text', nullable: false })
  desc_en: string;

  /**
   * location
   */
  @OneToOne(() => Location, (location) => location.house, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  location: Location;

  /**
   * characteristics
   */
  @Column({ type: 'int', unsigned: true, nullable: false })
  floors: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  rooms: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  bathrooms: number;

  @Column({ type: 'int', unsigned: true, nullable: false })
  area: number;

  @Column({ type: 'int', unsigned: true, nullable: true, default: 0 })
  balcony: number;

  /**
   * housing
   */
  @ManyToOne(() => HousingStock, (housing_stock) => housing_stock.houses, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  housing_stock: HousingStock;

  @ManyToMany(
    () => HousingCondition,
    (housing_condition) => housing_condition.houses,
  )
  @JoinTable()
  housing_conditions: HousingCondition[];

  @ManyToMany(() => HouseFeature, (feature) => feature.houses)
  @JoinTable()
  features: HouseFeature[];

  /**
   * media
   */
  @OneToMany(() => Media, (media) => media.house, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  media: Media[];

  /**
   * misc
   */
  @Column({ type: 'int', nullable: true, default: 1 })
  views: number;
}
