import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Level } from './entities/level.entity';
import { Repository } from 'typeorm';
import { CreateLevelDto } from './dto/create-level.dto';

@Injectable()
export class LevelService {
  constructor(
    @InjectRepository(Level)
    private levelRepository: Repository<Level>,
  ) {}

  async createDefaultLevel() {
    const defaultLevel = [
      { id: '1', name: 'SinhVien', description: 'SinhVien' },
      { id: '2', name: 'ThucTapSinh', description: 'ThucTapSinh' },
      { id: '3', name: 'MoiTotNghiep', description: 'MoiTotNghiep' },
      { id: '4', name: 'NhanVien', description: 'NhanVien' },
      { id: '5', name: 'QuanLy', description: 'QuanLy' },
      { id: '6', name: 'PhoGiamDoc', description: 'PhoGiamDoc' },
      { id: '7', name: 'GiamDoc', description: 'GiamDoc' },
      { id: '8', name: 'TongGiamDoc', description: 'TongGiamDoc' },
      { id: '9', name: 'ChuTich', description: 'ChuTich' },
      { id: '10', name: 'ChuTichHĐQT', description: 'ChuTichHĐQT' },
    ];

    await this.levelRepository.save(defaultLevel);
  }

  async create(dto: CreateLevelDto) {
    const level = this.levelRepository.create(dto);
    return this.levelRepository.save(level);
  }

  async findAll() {
    return this.levelRepository.find();
  }
}
