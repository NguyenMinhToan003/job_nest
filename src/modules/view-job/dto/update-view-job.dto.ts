import { PartialType } from '@nestjs/mapped-types';
import { CreateViewJobDto } from './create-view-job.dto';

export class UpdateViewJobDto extends PartialType(CreateViewJobDto) {}
