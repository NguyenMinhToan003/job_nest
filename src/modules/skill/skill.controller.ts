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
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Public, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { ROLE_LIST } from 'src/types/enum';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Post()
  async create(@Body() dto: CreateSkillDto) {
    return this.skillService.create({
      name: dto.name,
      description: dto.description,
    });
  }

  @Public()
  @Get()
  async getAll() {
    return this.skillService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Get('admin')
  findAllByAdmin() {
    return this.skillService.findAllByAdmin();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateSkillDto) {
    return this.skillService.update(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.skillService.delete(+id);
  }
}
