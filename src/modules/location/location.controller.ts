import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { Public, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ROLE_LIST } from 'src/types/enum';

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
  @Roles(ROLE_LIST.EMPLOYER)
  @Post()
  createLocation(@Req() req, @Body() body: CreateLocationDto) {
    const employerId = req.user.id;
    return this.locationService.createLocation(employerId, body);
  }
  @Get('employer')
  findByCompany(@Req() req) {
    const employerId = req.user.id;
    return this.locationService.findByCompany(employerId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Patch(':id')
  updateLocation(
    @Param('id') id: number,
    @Body() body: UpdateLocationDto,
    @Req() req,
  ) {
    const employerId = req.user.id;
    return this.locationService.updateLocation(+employerId, +id, body);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Patch('toggle-enable/:id')
  toggleEnableLocation(@Param('id') id: number, @Req() req) {
    const employerId = req.user.id;
    return this.locationService.toggleEnableLocation(+id, +employerId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Delete(':id')
  deleteLocation(@Param('id') id: number, @Req() req) {
    const employerId = req.user.id;
    return this.locationService.deleteLocation(+id, +employerId);
  }
}
