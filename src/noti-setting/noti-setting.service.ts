import { Injectable } from '@nestjs/common';
import { CreateNotiSettingDto } from './dto/create-noti-setting.dto';
import { UpdateNotiSettingDto } from './dto/update-noti-setting.dto';

@Injectable()
export class NotiSettingService {
  create(createNotiSettingDto: CreateNotiSettingDto) {
    return 'This action adds a new notiSetting';
  }

  findAll() {
    return `This action returns all notiSetting`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notiSetting`;
  }

  update(id: number, updateNotiSettingDto: UpdateNotiSettingDto) {
    return `This action updates a #${id} notiSetting`;
  }

  remove(id: number) {
    return `This action removes a #${id} notiSetting`;
  }
}
