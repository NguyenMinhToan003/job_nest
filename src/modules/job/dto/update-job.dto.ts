import { PartialType } from '@nestjs/mapped-types';
import { CreateJobDto } from './create-job.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { JOB_STATUS } from 'src/types/enum';

export class UpdateJobDto extends PartialType(CreateJobDto) {}
export class UpdateJobAdminDto extends PartialType(CreateJobDto) {
  @IsOptional()
  @IsEnum(JOB_STATUS)
  isActive?: JOB_STATUS;
}
