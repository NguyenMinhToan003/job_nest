import { PartialType } from '@nestjs/mapped-types';
import { CreateLocationDto } from './create-location.dto';
import { IsOptional } from 'class-validator';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  @IsOptional()
  enabled: number;
}
