import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MajorService } from './major.service';
import { CreateMajorDto } from './dto/create-major.dto';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';

@Controller('major')
export class MajorController {
  constructor(private majorService: MajorService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Post()
  async create(@Body() createMajorDto: CreateMajorDto) {
    return this.majorService.create(createMajorDto);
  }
  @Get()
  async findAll() {
    return this.majorService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Patch(':id')
  async update(
    @Body() createMajorDto: CreateMajorDto,
    @Param('id') id: number,
  ) {
    return this.majorService.update(id, createMajorDto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.majorService.remove(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.majorService.getOne(id);
  }
}
