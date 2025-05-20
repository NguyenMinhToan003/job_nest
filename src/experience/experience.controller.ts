import { Body, Controller, Get, Post } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { Public } from 'src/decorators/customize';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @Post()
  async createExperience(@Body() dto: CreateExperienceDto) {
    return this.experienceService.create(dto);
  }

  @Public()
  @Get()
  async getAllExperience() {
    return this.experienceService.findAll();
  }
}
