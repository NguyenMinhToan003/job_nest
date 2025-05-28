import { Module } from '@nestjs/common';
import { NotiAccountService } from './noti-account.service';
import { NotiAccountController } from './noti-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotiAccount } from './entities/noti-account.entity';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [AccountModule, TypeOrmModule.forFeature([NotiAccount])],
  controllers: [NotiAccountController],
  providers: [NotiAccountService],
})
export class NotiAccountModule {}
