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
import { LevelService } from './level.service';
import { CreateLevelDto } from './dto/create-level.dto';
import { Public, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { ROLE_LIST } from 'src/types/enum';
import { UpdateLevelDto } from './dto/update-level.dto';

@Controller('level')
export class LevelController {
  constructor(private readonly levelService: LevelService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Post()
  async create(@Body() dto: CreateLevelDto) {
    return this.levelService.create(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Get('admin')
  async getAllByAdmin() {
    return this.levelService.findAllByAdmin();
  }

  @Public()
  @Get()
  async getAll() {
    return this.levelService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateLevelDto) {
    return this.levelService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.levelService.delete(id);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Patch('toggle-status/:id')
  async toggleStatus(@Param('id') id: number) {
    return this.levelService.toggleStatus(id);
  }
}
