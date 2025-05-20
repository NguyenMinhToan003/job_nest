import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { Public, ROLE_LIST, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auth/passport/role.guard';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Public()
  @Get('map/:search')
  findByMap(@Param('search') search: string) {
    return this.locationService.findByMap(search);
  }
  @Public()
  @Get('map/detail/:placeId')
  findByMapDetail(@Param('placeId') placeId: string) {
    return this.locationService.findByMapDetail(placeId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.COMPANY)
  @Post()
  createLocation(@Req() req, @Body() body: CreateLocationDto) {
    const companyId = req.user.id;
    return this.locationService.createLocation(companyId, body);
  }
  @Get('company')
  findByCompany(@Req() req) {
    const companyId = req.user.id;
    return this.locationService.findByCompany(companyId);
  }
}
