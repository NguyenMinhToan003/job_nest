import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { Public, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { ROLE_LIST } from 'src/types/enum';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Public()
  @Get()
  findInBisiness() {
    return this.packagesService.findInBisiness();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('available')
  findAvailablePackages(@Req() req) {
    const employerId = req.user.id;
    return this.packagesService.findAvailablePackages(employerId);
  }
}
