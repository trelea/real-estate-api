import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      retryAttempts: 3,
      retryDelay: 3000,
      autoLoadEntities: true,
      keepAlive: true,
    }),
  ],
})
export class DatabaseModule extends TypeOrmModule {}
