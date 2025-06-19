import { Controller, Get } from '@nestjs/common';
import { BusinessTypeService } from './business-type.service';

@Controller('business-type')
export class BusinessTypeController {
  constructor(private readonly businessTypeService: BusinessTypeService) {}

  @Get()
  async getAllBusinessTypes() {
    return this.businessTypeService.findAll();
  }
}
