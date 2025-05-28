import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from 'src/modules/account/account.service';
import { Admin } from './entities/admin.entity';
import { ROLE_LIST } from 'src/types/enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private accountService: AccountService,
  ) {}
  async createAdminDefault() {
    const existingAdmin =
      await this.accountService.findEmail('admin@gmail.com');

    if (existingAdmin) {
      console.log('Default admin already exists.');
      return;
    }
    const account = await this.accountService.create({
      email: 'admin@gmail.com',
      password: '$2b$10$8nmRti0gi08ra0ZxjzTXMOKJ/S3oS2FhaL6ryVwnEVcMxKxI2/xRS',
      role: ROLE_LIST.ADMIN,
      googleId: null,
    });
    const admin = this.adminRepository.create({
      id: account.id,
      roleId: 1,
      status: 1,
    });
    await this.adminRepository.save(admin);
  }
}
