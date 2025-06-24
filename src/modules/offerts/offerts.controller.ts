import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { OffertsService } from './offerts.service';

@Controller('offerts')
export class OffertsController {
  constructor(private readonly offertsService: OffertsService) {}
  @Get('hot')
  async getOfferts(@Query('limit', ParseIntPipe) limit: number) {
    return this.offertsService.getHotOfferts(limit);
  }

  @Get('apartments')
  async getApartmentsOfferts(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('sort') sort: string,
  ) {
    return this.offertsService.getApartmentsOfferts(limit, page, sort);
  }

  @Get('apartments/hot')
  async getApartmentsHotOfferts(@Query('limit', ParseIntPipe) limit: number) {
    return this.offertsService.getApartmentsHotOfferts(limit);
  }

  @Get('houses')
  async getHousesOfferts(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('sort') sort: string,
  ) {
    return this.offertsService.getHousesOfferts(limit, page, sort);
  }

  @Get('houses/hot')
  async getHousesHotOfferts(@Query('limit', ParseIntPipe) limit: number) {
    return this.offertsService.getHousesHotOfferts(limit);
  }

  @Get('commercials')
  async getCommercialsOfferts(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('sort') sort: string,
  ) {
    return this.offertsService.getCommercialsOfferts(limit, page, sort);
  }

  @Get('commercials/hot')
  async getCommercialsHotOfferts(@Query('limit', ParseIntPipe) limit: number) {
    return this.offertsService.getCommercialsHotOfferts(limit);
  }

  @Get('terrains')
  async getTerrainsOfferts(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('sort') sort: string,
  ) {
    return this.offertsService.getTerrainsOfferts(limit, page, sort);
  }

  @Get('terrains/hot')
  async getTerrainsHotOfferts(@Query('limit', ParseIntPipe) limit: number) {
    return this.offertsService.getTerrainsHotOfferts(limit);
  }
}
