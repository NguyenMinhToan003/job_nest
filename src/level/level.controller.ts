import { Body, Controller, Get, Post } from '@nestjs/common';
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { Public } from 'src/decorators/customize';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @Post()
  async create(@Body() dto: CreateLevelDto) {
    return this.levelService.create(dto);
  }

  @Public()
  @Get()
  async getAll() {
    return this.levelService.findAll();
  }
}
