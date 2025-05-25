import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Major } from './entities/major.entity';
import { Repository } from 'typeorm';
import { CreateMajorDto } from './dto/create-major.dto';

@Injectable()
export class MajorService {
  constructor(
    @InjectRepository(Major)
    private majorRepository: Repository<Major>,
  ) {}
  //TiepThi/Marketing, KeToan/Accounting, QuanTriKinhDoanh/BusinessAdministration, QuanLyChungKhoan/SecuritiesManagement, QuanLyNganHang/BankManagement, QuanLyDuAn/ProjectManagement, QuanLyChuyenMon/ProfessionalManagement, QuanLyChuyenVien/ProfessionalManager, QuanLyNhaHang/RestaurantManagement, QuanLyKhachSan/HotelManagement, QuanLyDuLich/TourismManagement
  async createDefaultMajor() {
    const defaultMajor = [
      { id: '1', name: 'TiepThi', description: 'Marketing', status: 1 },
      { id: '2', name: 'KeToan', description: 'Accounting', status: 1 },
      {
        id: '3',
        name: 'QuanTriKinhDoanh',
        description: 'BusinessAdministration',
        status: 1,
      },
      {
        id: '4',
        name: 'QuanLyChungKhoan',
        description: 'SecuritiesManagement',
        status: 1,
      },
      {
        id: '5',
        name: 'QuanLyNganHang',
        description: 'BankManagement',
        status: 1,
      },
      {
        id: '6',
        name: 'QuanLyDuAn',
        description: 'ProjectManagement',
        status: 1,
      },
      {
        id: '7',
        name: 'QuanLyChuyenMon',
        description: 'ProfessionalManagement',
        status: 1,
      },
      {
        id: '8',
        name: 'QuanLyChuyenVien',
        description: 'ProfessionalManager',
        status: 1,
      },
      {
        id: '9',
        name: 'QuanLyNhaHang',
        description: 'RestaurantManagement',
        status: 1,
      },
      {
        id: '10',
        name: 'QuanLyKhachSan',
        description: 'HotelManagement',
        status: 1,
      },
      {
        id: '11',
        name: 'QuanLyDuLich',
        description: 'TourismManagement',
        status: 1,
      },
    ];

    await this.majorRepository.save(defaultMajor);
  }

  async create(dto: CreateMajorDto) {
    const major = this.majorRepository.create(dto);
    return this.majorRepository.save(major);
  }
  async findAll() {
    return this.majorRepository.find();
  }
}
