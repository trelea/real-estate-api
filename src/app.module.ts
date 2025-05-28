import { Module } from '@nestjs/common';
import { AuthModule } from './core/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { UsersModule } from './modules/users/users.module';
import { BlogsModule } from './modules/blogs/blogs.module';
import { ServicesModule } from './modules/services/services.module';
import { HousingStocksModule } from './modules/housing-stocks';
import { HousingConditionsModule } from './modules/housing-conditions';
import { ApartmentsModule } from './modules/apartments/apartments';
import { ApartmentsFeaturesModule } from './modules/apartments/apartments-features';
import { HousesModule } from './modules/houses/houses';
import { HousesFeaturesModule } from './modules/houses/houses-features';
import { CommercialsDestinationsModule } from './modules/commercials/commercials-destinations';
import { CommercialsFeaturesModule } from './modules/commercials/commercials-features';
import { CommercialsPlacingsModule } from './modules/commercials/commercials-placings';
import { CommercialsModule } from './modules/commercials/commercials';
import { TerrainsUsabilitiesModule } from './modules/terrains/terrains-usabilities';
import { TerrainsFeaturesModule } from './modules/terrains/terrains-features';
import { TerrainsModule } from './modules/terrains/terrains';
import { TermsAndConditionsModule } from './modules/terms-and-conditions';
import { AboutUsModule } from './modules/about-us';
import { PrivacyPolicyModule } from './modules/privacy-policy';

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
    /**
     * Apartments
     */
    ApartmentsFeaturesModule,
    ApartmentsModule,
    /**
     * Houses
     */
    HousesFeaturesModule,
    HousesModule,
    /**
     * Commercials
     */
    CommercialsDestinationsModule,
    CommercialsPlacingsModule,
    CommercialsFeaturesModule,
    CommercialsModule,
    /**
     * Terrains
     */
    TerrainsUsabilitiesModule,
    TerrainsFeaturesModule,
    TerrainsModule,
    /**
     * about us, policy, terms and conditions
     */
    TermsAndConditionsModule,
    AboutUsModule,
    PrivacyPolicyModule,
  ],
})
export class AppModule {}
