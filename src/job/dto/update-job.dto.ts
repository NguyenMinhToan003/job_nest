import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsOptional } from 'class-validator';

export class UpdateJobDto extends PartialType(CreateJobDto) {}
export class UpdateJobAdminDto extends PartialType(CreateJobDto) {
  @IsOptional()
  isActive?: number;
}
