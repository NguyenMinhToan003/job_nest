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
import { FieldService } from './field.service';
import { Public, Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { CreateFieldDto } from './dto/create-field.dto';

@Controller('field')
export class FieldController {
  constructor(private readonly fieldService: FieldService) {}

  @Public()
  @Get()
  async getAllFields() {
    return this.fieldService.findAll();
  }

  @Public()
  @Get(':id')
  async getFieldById(@Param('id') id: number) {
    return this.fieldService.findById(id);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Post()
  async createFields(@Body() dto: CreateFieldDto) {
    return this.fieldService.createFields(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Patch(':id')
  async updateField(@Param('id') id: number, @Body() dto: CreateFieldDto) {
    return this.fieldService.updateField(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Delete(':id')
  async deleteField(@Param('id') id: number) {
    return this.fieldService.deleteField(id);
  }
}
