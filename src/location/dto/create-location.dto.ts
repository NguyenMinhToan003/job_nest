import { IsNotEmpty } from 'class-validator';
import { District } from 'src/district/entities/district.entity';

export class CreateLocationDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  district: District;
  @IsNotEmpty()
  plandId: string;
  @IsNotEmpty()
  city: string;
}
