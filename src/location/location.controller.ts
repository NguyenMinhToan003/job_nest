import { Controller, Get, Param } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('map/:search')
  findByMap(@Param('search') search: string) {
    return this.locationService.findByMap(search);
  }
  @Get('map/detail/:placeId')
  findByMapDetail(@Param('placeId') placeId: string) {
    return this.locationService.findByMapDetail(placeId);
  }
}
