import { PartialType } from '@nestjs/mapped-types';
import { CreateExperienceDto } from './create-experience.dto';
import { IsOptional } from 'class-validator';

export class UpdateExperienceDto extends PartialType(CreateExperienceDto) {
  @IsOptional()
  status?: number;
}
