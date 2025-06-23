import { Controller, Get } from '@nestjs/common';
import { EmployerScalesService } from './employer-scales.service';
import { Public } from 'src/decorators/customize';

@Controller('employer-scales')
export class EmployerScalesController {
  constructor(private readonly employerScalesService: EmployerScalesService) {}

  @Public()
  @Get()
  async getAllEmployerScales() {
    return this.employerScalesService.findAll();
  }
}
