import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeVersionDto } from './create-resume-version.dto';

export class UpdateResumeVersionDto extends PartialType(
  CreateResumeVersionDto,
) {}
