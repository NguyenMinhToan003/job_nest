import { Controller, Get, Post } from '@nestjs/common';
import { CreateTypeJobDto } from './dto/create-type-job.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeJob } from './entities/type-job.entity';
import { Repository } from 'typeorm';
import { Public } from 'src/decorators/customize';

@Controller('type-job')
export class TypeJobController {
  constructor(
    @InjectRepository(TypeJob)
    private readonly typeJobRepository: Repository<TypeJob>,
  ) {}

  @Post()
  async create(dto: CreateTypeJobDto) {
    return this.typeJobRepository.create(dto);
  }

  @Public()
  @Get()
  async getAll() {
    return this.typeJobRepository.find();
  }
}
