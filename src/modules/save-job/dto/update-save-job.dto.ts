import { PartialType } from '@nestjs/mapped-types';
import { CreateSaveJobDto } from './create-save-job.dto';

export class UpdateSaveJobDto extends PartialType(CreateSaveJobDto) {}
