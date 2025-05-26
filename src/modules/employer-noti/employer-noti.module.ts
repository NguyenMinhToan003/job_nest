import { Module } from '@nestjs/common';
import { EmployerNotiService } from './employer-noti.service';
import { EmployerNotiController } from './employer-noti.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerNoti } from './entities/employer-noti.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployerNoti])],
  controllers: [EmployerNotiController],
  providers: [EmployerNotiService],
})
export class EmployerNotiModule {}
