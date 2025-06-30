import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';

@Injectable()
export class ValidationLocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}
  async validatePlaceIdExist(placeId: string, companyId: number) {
    const location = await this.locationRepository.findOne({
      where: {
        placeId,
        employer: {
          id: companyId,
        },
      },
    });
    if (location) {
      throw new BadRequestException('Địa điểm đã tồn tại');
    }
    return location;
  }
}
