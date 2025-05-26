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
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { Public, Roles } from 'src/decorators/customize';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { ROLE_LIST } from 'src/types/enum';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Controller('experience')
export class ExperienceController {
  constructor(private readonly experienceService: ExperienceService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Post()
  async createExperience(@Body() dto: CreateExperienceDto) {
    return this.experienceService.create(dto);
  }

  @Public()
  @Get()
  async getAllExperience() {
    return this.experienceService.findAll();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Get('admin')
  async getAllExperienceAdmin() {
    return this.experienceService.findAllAdmin();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Patch(':id')
  async updateExperience(
    @Param('id') id: number,
    @Body() dto: UpdateExperienceDto,
  ) {
    return this.experienceService.update(+id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Delete(':id')
  async deleteExperience(@Param('id') id: number) {
    return this.experienceService.delete(+id);
  }
}
