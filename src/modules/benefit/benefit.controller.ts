import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BenefitService } from './benefit.service';
import { Public, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { ROLE_LIST } from 'src/types/enum';
import { CreateBenefitDto } from './dto/create-benefit.dto';

@Controller('benefit')
export class BenefitController {
  constructor(private readonly benefitService: BenefitService) {}

  @Public()
  @Get()
  findAll() {
    return this.benefitService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Post()
  create(@Body() createBenefitDto: CreateBenefitDto) {
    return this.benefitService.create(createBenefitDto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBenefitDto: CreateBenefitDto) {
    return this.benefitService.update(id, updateBenefitDto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.benefitService.delete(id);
  }
}
