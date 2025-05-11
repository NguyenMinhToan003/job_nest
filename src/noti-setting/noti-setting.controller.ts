import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotiSettingService } from './noti-setting.service';
import { CreateNotiSettingDto } from './dto/create-noti-setting.dto';
import { UpdateNotiSettingDto } from './dto/update-noti-setting.dto';

@Controller('noti-setting')
export class NotiSettingController {
  constructor(private readonly notiSettingService: NotiSettingService) {}

  @Post()
  create(@Body() createNotiSettingDto: CreateNotiSettingDto) {
    return this.notiSettingService.create(createNotiSettingDto);
  }

  @Get()
  findAll() {
    return this.notiSettingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notiSettingService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotiSettingDto: UpdateNotiSettingDto,
  ) {
    return this.notiSettingService.update(+id, updateNotiSettingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notiSettingService.remove(+id);
  }
}
