import { Controller, Get } from '@nestjs/common';
import { EducationService } from './education.service';
import { Public } from 'src/decorators/customize';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}
  @Public()
  @Get()
  async getAllEducation() {
    return this.educationService.getAllEducation();
  }
}
