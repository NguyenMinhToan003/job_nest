import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from 'src/account/account.service';
import { ROLE_LIST } from 'src/decorators/customize';
import { Admin } from './entities/admin.entity';

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
      password: '1',
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
  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
