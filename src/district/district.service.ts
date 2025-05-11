import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { District } from './entities/district.entity';
import { cleanNameDistrict } from 'src/helpers/string';

@Injectable()
export class DistrictService {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}
  async fetchAll() {
    const citys = await axios.get('https://provinces.open-api.vn/api/?depth=2');
    for (const city of citys.data) {
      for (const district of city.districts) {
        this.districtRepository.save({
          id: district.codename,
          name: cleanNameDistrict(district.name),
          city: city.codename,
        } as District);
      }
    }
  }

  async searchDistrictAndCityId(search: string, cityId: string) {
    return this.districtRepository.find({
      where: {
        name: Like(`%${search}%`),
        city: {
          id: cityId,
        },
      },
    });
  }
}
