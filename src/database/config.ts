import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import {
  Blog,
  BlogContent,
  HousingCondition,
  HousingStock,
  Profile,
  Service,
  ServiceContent,
  User,
} from './entities';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config();

export const dataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV !== 'prod',
  logging: process.env.NODE_ENV !== 'prod',
  entities: [
    User,
    Profile,
    Blog,
    BlogContent,
    Service,
    ServiceContent,
    HousingStock,
    HousingCondition,
  ],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  subscribers: [],
} as TypeOrmModuleOptions;

export const dataSource = new DataSource(
  dataSourceOptions as DataSourceOptions,
);
