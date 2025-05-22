import { IsNotEmpty } from 'class-validator';
import { District } from 'src/district/entities/district.entity';

export class CreateLocationDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  district: District;
  @IsNotEmpty()
  placeId: string;
  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  lat: number;

  @IsNotEmpty()
  lng: number;
}
