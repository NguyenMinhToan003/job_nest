import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SaveJobService } from './save-job.service';
import { CreateSaveJobDto } from './dto/create-save-job.dto';
import { UpdateSaveJobDto } from './dto/update-save-job.dto';

@Controller('save-job')
export class SaveJobController {
  constructor(private readonly saveJobService: SaveJobService) {}

  @Post()
  create(@Body() createSaveJobDto: CreateSaveJobDto) {
    return this.saveJobService.create(createSaveJobDto);
  }

  @Get()
  findAll() {
    return this.saveJobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.saveJobService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaveJobDto: UpdateSaveJobDto) {
    return this.saveJobService.update(+id, updateSaveJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.saveJobService.remove(+id);
  }
}
