import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsOptional } from 'class-validator';

export class UpdateJobDto extends PartialType(CreateJobDto) {
  @IsOptional()
  isShow?: number;
}
export class UpdateJobAdminDto extends PartialType(CreateJobDto) {
  @IsOptional()
  status?: number;

  // @IsOptional()
  // isHot?: boolean;

  // @IsOptional()
  // isUrgent?: boolean;
}
