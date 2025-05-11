import { Controller, Get, Param } from '@nestjs/common';
import { CityService } from './city.service';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  @Get()
  getCity() {
    return this.cityService.getCity();
  }
  @Get('search/:search')
  searchCity(@Param('search') search: string) {
    return this.cityService.searchCity(search);
  }
}
