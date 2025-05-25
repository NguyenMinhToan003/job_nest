import { Controller, Get } from '@nestjs/common';
import { BenefitService } from './benefit.service';
import { Public } from 'src/decorators/customize';

@Controller('benefit')
export class BenefitController {
  constructor(private readonly benefitService: BenefitService) {}

  @Public()
  @Get()
  findAll() {
    return this.benefitService.findAll();
  }
}
