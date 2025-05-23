import { Module } from '@nestjs/common';
import { AuthModule } from './core/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { CryptoService } from './crypto/crypto.service';
import { UsersModule } from './modules/users/users.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { ServicesModule } from './modules/services/services.module';
import { HousingStocksModule } from './modules/housing-stocks';
import { HousingConditionsModule } from './modules/housing-conditions';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    BlogsModule,
    ServicesModule,
    HousingStocksModule,
    HousingConditionsModule,
  ],
  providers: [CryptoService],
})
export class AppModule {}
