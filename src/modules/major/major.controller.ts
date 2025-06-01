import { Controller, Get, Post, Body } from '@nestjs/common';
import { MajorService } from './major.service';
import { CreateMajorDto } from './dto/create-major.dto';

@Controller('major')
export class MajorController {
  constructor(private majorService: MajorService) {}

  @Post()
  async create(@Body() createMajorDto: CreateMajorDto) {
    return this.majorService.create(createMajorDto);
  }
  @Get()
  async findAll() {
    return this.majorService.findAll();
  }
}
