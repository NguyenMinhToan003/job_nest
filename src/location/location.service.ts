import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { CreateLocationDto } from './dto/create-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly configService: ConfigService,
  ) {}

  async findByMap(search: string) {
    try {
      const response = await axios.get(
        `https://rsapi.goong.io/place/autocomplete?api_key=${this.configService.get('GOONG_API_KEY')}&input=${search}`,
      );
      const data = response.data;
      data.predictions = data.predictions.map((item) => {
        return {
          name: item.description,
          plandId: item.place_id,
        };
      });
      return data;
    } catch (error) {
      console.error('Error fetching data from Goong API:', error);
      throw new Error('Failed to fetch location data');
    }
  }
  async findByMapDetail(placeId: string) {
    const response = await axios.get(
      `https://rsapi.goong.io/place/detail?api_key=${this.configService.get('GOONG_API_KEY')}&place_id=${placeId}`,
    );
    const data = response.data;
    return {
      placeId: data.result.place_id,
      name: data.result.formatted_address,
      location: {
        lat: data.result.geometry.location.lat,
        lng: data.result.geometry.location.lng,
      },
      city: data.result.compound.province,
      district: data.result.compound.district,
    };
  }

  async createLocation(companyId: number, body: CreateLocationDto) {
    return await this.locationRepository.save({
      name: body.name,
      plandId: body.plandId,
      city: body.city,
      district: body.district,
      company: { id: companyId },
    });
  }
  async findByCompany(companyId: number) {
    return await this.locationRepository.find({
      where: {
        company: {
          id: companyId,
        },
      },
      relations: {
        district: {
          city: true,
        },
      },
    });
  }
}
