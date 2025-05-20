import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BenefitService } from './benefit.service';
import { CreateBenefitDto } from './dto/create-benefit.dto';
import { UpdateBenefitDto } from './dto/update-benefit.dto';
import { Public } from 'src/decorators/customize';

@Controller('benefit')
export class BenefitController {
  constructor(private readonly benefitService: BenefitService) {}

  @Post()
  create(@Body() createBenefitDto: CreateBenefitDto) {
    return this.benefitService.create(createBenefitDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.benefitService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.benefitService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBenefitDto: UpdateBenefitDto) {
    return this.benefitService.update(+id, updateBenefitDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.benefitService.remove(+id);
  }
}
