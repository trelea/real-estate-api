import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { GlobalEntityUUID } from './_';
import { User } from './user';
import { HousingStock } from './housing-stock';
import { HousingCondition } from './housing-condition';
import { ApartmentFeature } from './apartment-feature';
import { Media } from './media';

export enum ApartmentOffert {
  SALE = 'SALE',
  RENT = 'RENT',
}

export enum ApartmentStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Entity()
export class Apartment extends GlobalEntityUUID {
  @Column({ type: 'enum', enum: ApartmentOffert, nullable: false })
  offert: ApartmentOffert;

  @Column({ type: 'decimal', nullable: false })
  price: number;

  @Column({ type: 'decimal', nullable: true, default: 1 })
  price_square: number;

  @Column({ type: 'int', nullable: false })
  surface: number;

  @Column({ type: 'int', nullable: false })
  rooms: number;

  @Column({ type: 'int', nullable: false })
  sanitary_blocks: number;

  @Column({ type: 'int', nullable: false })
  floor: number;

  @Column({
    type: 'enum',
    enum: ApartmentStatus,
    nullable: true,
    default: ApartmentStatus.PRIVATE,
  })
  status: ApartmentStatus;

  @Column({ type: 'boolean', nullable: true, default: false })
  hot: boolean;

  @Column({ type: 'int', nullable: true, default: 1 })
  views: number;

  @Column({ type: 'text', nullable: true })
  desc_ro: string;

  @Column({ type: 'text', nullable: true })
  desc_ru: string;

  @Column({ type: 'text', nullable: true })
  desc_en: string;

  /**
   * relations
   */

  /**
   * user
   */
  @ManyToOne(() => User, (user) => user.apartments)
  user: User;
  /**
   * stock
   */
  @ManyToOne(() => HousingStock, (stock) => stock.apartments)
  stock: HousingStock;
  /**
   * conditions
   */
  @ManyToMany(() => HousingCondition, (condition) => condition.apartments)
  @JoinTable()
  conditions: HousingCondition[];
  /**
   * features
   */
  @ManyToMany(() => ApartmentFeature, (feature) => feature.apartments)
  @JoinTable()
  features: ApartmentFeature[];
  /**
   * madia
   */
  @ManyToMany(() => Media, (media) => media.apartments)
  @JoinTable()
  media: Media[];
}
