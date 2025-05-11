import { PartialType } from '@nestjs/mapped-types';
import { CreateNotiSettingDto } from './create-noti-setting.dto';

export class UpdateNotiSettingDto extends PartialType(CreateNotiSettingDto) {}
