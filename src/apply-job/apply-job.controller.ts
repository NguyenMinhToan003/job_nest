import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApplyJobService } from './apply-job.service';
import { CreateApplyJobDto } from './dto/create-apply-job.dto';
import { UpdateApplyJobDto } from './dto/update-apply-job.dto';

@Controller('apply-job')
export class ApplyJobController {
  constructor(private readonly applyJobService: ApplyJobService) {}

  @Post()
  create(@Body() createApplyJobDto: CreateApplyJobDto) {
    return this.applyJobService.create(createApplyJobDto);
  }

  @Get()
  findAll() {
    return this.applyJobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applyJobService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApplyJobDto: UpdateApplyJobDto,
  ) {
    return this.applyJobService.update(+id, updateApplyJobDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applyJobService.remove(+id);
  }
}
