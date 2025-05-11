import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TypeJobService } from './type-job.service';
import { CreateTypeJobDto } from './dto/create-type-job.dto';
import { UpdateTypeJobDto } from './dto/update-type-job.dto';

@Controller('type-job')
export class TypeJobController {
  constructor(private readonly typeJobService: TypeJobService) {}

  @Post()
  create(@Body() createTypeJobDto: CreateTypeJobDto) {
    return this.typeJobService.create(createTypeJobDto);
  }

  @Get()
  findAll() {
    return this.typeJobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeJobService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeJobDto: UpdateTypeJobDto) {
    return this.typeJobService.update(+id, updateTypeJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeJobService.remove(+id);
  }
}
