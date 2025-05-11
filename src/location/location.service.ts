import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocationService {
  constructor(private readonly configService: ConfigService) {}

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
}
