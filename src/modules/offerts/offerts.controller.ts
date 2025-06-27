import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { OffertsService } from './offerts.service';
import { ParseIntPipeOptional } from 'src/shared/pipes';

@Controller('offerts')
export class OffertsController {
  constructor(private readonly offertsService: OffertsService) {}
  @Get('hot')
  async getOfferts(@Query('limit', ParseIntPipe) limit: number) {
    return this.offertsService.getHotOfferts(limit);
  }

  @Get('apartments')
  async getApartmentsOfferts(
    @Query('limit', ParseIntPipeOptional) limit: number,
    @Query('page', ParseIntPipeOptional) page: number,
    @Query('sort') sort: string,
    @Query('filter') filter?: string,
  ) {
    return this.offertsService.getApartmentsOfferts(
      limit,
      page,
      sort,
      filter ? JSON.parse(filter) : {},
    );
  }

  @Get('apartments/hot')
  async getApartmentsHotOfferts(@Query('limit', ParseIntPipe) limit: number) {
    return this.offertsService.getApartmentsHotOfferts(limit);
  }

  @Get('houses')
  async getHousesOfferts(
    @Query('limit', ParseIntPipeOptional) limit: number,
    @Query('page', ParseIntPipeOptional) page: number,
    @Query('sort') sort: string,
    @Query('filter') filter?: string,
  ) {
    return this.offertsService.getHousesOfferts(
      limit,
      page,
      sort,
      filter ? JSON.parse(filter) : {},
    );
  }

  @Get('houses/hot')
  async getHousesHotOfferts(
    @Query('limit', ParseIntPipeOptional) limit: number,
  ) {
    return this.offertsService.getHousesHotOfferts(limit);
  }

  @Get('commercials')
  async getCommercialsOfferts(
    @Query('limit', ParseIntPipeOptional) limit: number,
    @Query('page', ParseIntPipeOptional) page: number,
    @Query('sort') sort: string,
    @Query('filter') filter?: string,
  ) {
    return this.offertsService.getCommercialsOfferts(
      limit,
      page,
      sort,
      filter ? JSON.parse(filter) : {},
    );
  }

  @Get('commercials/hot')
  async getCommercialsHotOfferts(
    @Query('limit', ParseIntPipeOptional) limit: number,
  ) {
    return this.offertsService.getCommercialsHotOfferts(limit);
  }

  @Get('terrains')
  async getTerrainsOfferts(
    @Query('limit', ParseIntPipeOptional) limit: number,
    @Query('page', ParseIntPipeOptional) page: number,
    @Query('sort') sort: string,
    @Query('filter') filter?: string,
  ) {
    return this.offertsService.getTerrainsOfferts(
      limit,
      page,
      sort,
      filter ? JSON.parse(filter) : {},
    );
  }

  @Get('terrains/hot')
  async getTerrainsHotOfferts(
    @Query('limit', ParseIntPipeOptional) limit: number,
  ) {
    return this.offertsService.getTerrainsHotOfferts(limit);
  }
}
