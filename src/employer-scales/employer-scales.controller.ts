import { Controller, Get } from '@nestjs/common';
import { EmployerScalesService } from './employer-scales.service';

@Controller('employer-scales')
export class EmployerScalesController {
  constructor(private readonly employerScalesService: EmployerScalesService) {}

  @Get()
  async getAllEmployerScales() {
    return this.employerScalesService.findAll();
  }
}
