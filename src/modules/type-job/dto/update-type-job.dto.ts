import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeJobDto } from './create-type-job.dto';

export class UpdateTypeJobDto extends PartialType(CreateTypeJobDto) {
  status?: number;
}
