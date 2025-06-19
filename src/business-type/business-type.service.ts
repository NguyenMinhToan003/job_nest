import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessType } from './entities/business-type.entity';

@Injectable()
export class BusinessTypeService {
  constructor(
    @InjectRepository(BusinessType)
    private businessTypeRepository: Repository<BusinessType>,
  ) {}
  async createDefaultBusinessTypes() {
    const defaultBusinessTypes = [
      { name: 'Công ty TNHH', status: 1 },
      { name: 'Công ty Cổ phần', status: 1 },
      { name: 'Doanh nghiệp tư nhân', status: 1 },
      { name: 'Hợp tác xã', status: 1 },
    ];

    for (const type of defaultBusinessTypes) {
      const exists = await this.businessTypeRepository.findOne({
        where: { name: type.name },
      });
      if (!exists) {
        await this.businessTypeRepository.save(type);
      }
    }
  }

  async findAll() {
    return this.businessTypeRepository.find();
  }
}
