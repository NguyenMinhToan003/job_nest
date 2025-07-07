import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Like, Repository } from 'typeorm';
import axios from 'axios';
import { cleanNameProvince } from 'src/helpers/string';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}
  async fetchAll() {
    try {
      const citys = await axios.get(
        'http://provinces.open-api.vn/api/?depth=2',
      );
      for (const city of citys.data) {
        this.cityRepository.save({
          id: city.codename,
          name: cleanNameProvince(city.name),
        } as City);
      }
      return citys.data;
    } catch (error) {
      console.error('Error fetching cities:', error);
      throw new Error('Failed to fetch cities');
    }
  }
  getCity() {
    return this.cityRepository.find({
      relations: {
        districts: true,
      },
    });
  }
  searchCity(search: string) {
    return this.cityRepository.find({
      where: {
        name: Like(`%${search}%`),
      },
    });
  }
}
