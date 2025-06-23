import { Controller, Get } from '@nestjs/common';
import { BusinessTypeService } from './business-type.service';
import { Public } from 'src/decorators/customize';

@Controller('business-type')
export class BusinessTypeController {
  constructor(private readonly businessTypeService: BusinessTypeService) {}

  @Public()
  @Get()
  async getAllBusinessTypes() {
    return this.businessTypeService.findAll();
  }
}
