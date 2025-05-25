import { Module } from '@nestjs/common';
import { NotiSettingService } from './noti-setting.service';
import { NotiSettingController } from './noti-setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotiSetting } from './entities/noti-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotiSetting])],
  controllers: [NotiSettingController],
  providers: [NotiSettingService],
})
export class NotiSettingModule {}
