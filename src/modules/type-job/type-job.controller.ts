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
import { CreateTypeJobDto } from './dto/create-type-job.dto';
import { Public, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { ROLE_LIST } from 'src/types/enum';
import { TypeJobService } from './type-job.service';

@Controller('type-job')
export class TypeJobController {
  constructor(private typeJobService: TypeJobService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Post()
  async create(@Body() dto: CreateTypeJobDto) {
    return this.typeJobService.create(dto);
  }

  @Public()
  @Get()
  async getAll() {
    return this.typeJobService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: CreateTypeJobDto) {
    return this.typeJobService.update(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.typeJobService.delete(+id);
  }
}
