import { Controller, Get, Param } from '@nestjs/common';
import { DistrictService } from './district.service';

@Controller('district')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get('search/:cityId/:search')
  searchDistrictCityId(
    @Param('search') search: string,
    @Param('cityId') cityId: string,
  ) {
    return this.districtService.searchDistrictAndCityId(search, cityId);
  }
}
