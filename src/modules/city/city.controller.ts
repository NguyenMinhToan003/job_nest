import { Controller, Get, Param } from '@nestjs/common';
import { CityService } from './city.service';
import { Public } from 'src/decorators/customize';

@Controller('city')
export class CityController {
  constructor(private readonly cityService: CityService) {}
  @Public()
  @Get()
  getCity() {
    return this.cityService.getCity();
  }
  @Public()
  @Get('search/:search')
  searchCity(@Param('search') search: string) {
    return this.cityService.searchCity(search);
  }
}
