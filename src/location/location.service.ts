import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { CreateLocationDto } from './dto/create-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Location } from './entities/location.entity';
import { Repository } from 'typeorm';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ValidationLocationService } from './validationLocation.service';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    private readonly validationLocationService: ValidationLocationService,
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
          placeId: item.place_id,
        };
      });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      throw new BadRequestException('Error fetching data from Goong API');
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
    await this.validationLocationService.validatePlaceIdExist(
      body.placeId,
      companyId,
    );
    return await this.locationRepository.save({
      name: body.name,
      placeId: body.placeId,
      city: body.city,
      district: body.district,
      employer: { id: companyId },
      lat: body.lat,
      lng: body.lng,
    });
  }
  async findByCompany(companyId: number, enabled?: number) {
    const where = {
      employer: {
        id: companyId,
      },
    };
    if (enabled) {
      where['enabled'] = enabled;
    }
    return await this.locationRepository.find({
      where,
      relations: {
        district: {
          city: true,
        },
      },
    });
  }
  async updateLocation(companyId: number, id: number, body: UpdateLocationDto) {
    const location = await this.locationRepository.findOne({
      where: {
        id,
        employer: {
          id: companyId,
        },
      },
    });
    if (!location) {
      throw new NotFoundException('Location not found');
    }
    return await this.locationRepository.save({
      ...location,
      ...body,
    });
  }

  async toggleEnableLocation(id: number, companyId: number) {
    const listLocation = await this.locationRepository.find({
      where: {
        employer: {
          id: companyId,
        },
      },
    });
    const countLocationEnabled = listLocation.filter(
      (location) => location.enabled === 1,
    ).length;
    if (countLocationEnabled >= 4 && !listLocation[id].enabled) {
      throw new BadRequestException('Chỉ được tối đa 4 địa điểm');
    }
    const location = await this.findOne(id, companyId);
    return await this.locationRepository.save({
      ...location,
      enabled: location.enabled === 1 ? 0 : 1,
    });
  }
  async findOne(id, companyId: number) {
    const location = await this.locationRepository.findOne({
      where: {
        id,
        employer: {
          id: companyId,
        },
      },
    });
    if (!location) {
      throw new NotFoundException('Địa điểm không tồn tại');
    }
    return location;
  }

  async deleteLocation(id: number, companyId: number) {
    await this.findOne(id, companyId);
    return await this.locationRepository.delete({ id });
  }
}
