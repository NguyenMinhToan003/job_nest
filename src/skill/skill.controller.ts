import { Controller, Get, Post } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Public } from 'src/decorators/customize';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  async create(dto: CreateSkillDto) {
    return this.skillService.create(dto);
  }

  @Public()
  @Get()
  async getAll() {
    return this.skillService.findAll();
  }
}
