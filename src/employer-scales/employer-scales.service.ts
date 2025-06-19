import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployerScale } from './entities/employer-scale.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EmployerScalesService {
  constructor(
    @InjectRepository(EmployerScale)
    private employerScaleRepository: Repository<EmployerScale>,
  ) {}
  async createDefaultEmployerScales() {
    const defaultScales = [
      { name: 'Dưới 10 người', status: 1 },
      { name: 'Từ 10 đến 50 người', status: 1 },
      { name: 'Từ 51 đến 200 người', status: 1 },
      { name: 'Trên 200 người', status: 1 },
    ];

    for (const scale of defaultScales) {
      const exists = await this.employerScaleRepository.findOne({
        where: { name: scale.name },
      });
      if (!exists) {
        await this.employerScaleRepository.save(scale);
      }
    }
  }

  async findAll() {
    return this.employerScaleRepository.find();
  }
}
