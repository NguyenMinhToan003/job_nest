import { PartialType } from '@nestjs/mapped-types';
import { CreateApplyJobDto } from './create-apply-job.dto';

export class UpdateApplyJobDto extends PartialType(CreateApplyJobDto) {}
