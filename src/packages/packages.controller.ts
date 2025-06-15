import { Controller, Get } from '@nestjs/common';
import { PackagesService } from './packages.service';
import { Public } from 'src/decorators/customize';

@Controller('packages')
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Public()
  @Get()
  findInBisiness() {
    return this.packagesService.findInBisiness();
  }
}
