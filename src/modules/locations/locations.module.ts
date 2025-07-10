import { Module } from '@nestjs/common';
import { CategoriesController } from './categories/categories.controller';
import { CategoriesService } from './categories/categories.service';
import { SubcategoriesController } from './subcategories/subcategories.controller';
import { SubcategoriesService } from './subcategories/subcategories.service';
import { DatabaseModule } from 'src/database';
import { LocationCategory, LocationSubcategory } from 'src/database/entities';

@Module({
  imports: [DatabaseModule.forFeature([LocationCategory, LocationSubcategory])],
  controllers: [CategoriesController, SubcategoriesController],
  providers: [CategoriesService, SubcategoriesService],
})
export class LocationsModule {}
