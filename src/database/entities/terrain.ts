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
import { TerrainFeature } from './terrain-feature';
import { TerrainUsability } from './terrain-usability';
import { Media } from './media';

export enum TerrainOffert {
  SALE = 'SALE',
  RENT = 'RENT',
}

export enum TerrainStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

@Entity()
export class Terrain extends GlobalEntityIncrement {
  @Column({ type: 'simple-array', nullable: false })
  offert: TerrainOffert[];

  @ManyToOne(() => User, (user) => user.terrains, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  user: User;

  @Column({ type: 'decimal', nullable: false })
  price: number;

  @Column({ type: 'boolean', nullable: true, default: false })
  hot: boolean;

  @Column({ type: 'enum', enum: TerrainStatus, default: TerrainStatus.PRIVATE })
  status: TerrainStatus;

  @Column({ type: 'text', nullable: true })
  desc_ro: string;
  @Column({ type: 'text', nullable: true })
  desc_ru: string;
  @Column({ type: 'text', nullable: true })
  desc_en: string;

  /** location */
  @OneToOne(() => Location, (loc) => loc.terrain, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  location: Location;

  /** characteristics */
  @Column({ type: 'int', unsigned: true, nullable: false })
  area: number;

  @ManyToMany(() => TerrainUsability, (u) => u.terrains)
  @JoinTable()
  usability: TerrainUsability[];

  @ManyToMany(() => TerrainFeature, (f) => f.terrains)
  @JoinTable()
  features: TerrainFeature[];

  /** media */
  @OneToMany(() => Media, (media) => media.terrain, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  media: Media[];

  @Column({ type: 'int', nullable: true, default: 1 })
  views: number;
}
