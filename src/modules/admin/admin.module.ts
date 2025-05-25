import { Module, OnModuleInit } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/modules/account/account.module';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [AccountModule, TypeOrmModule.forFeature([Admin])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule implements OnModuleInit {
  constructor(private readonly adminService: AdminService) {}
  onModuleInit() {
    this.adminService.createAdminDefault();
  }
}
