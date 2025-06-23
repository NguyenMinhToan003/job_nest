import { PartialType } from '@nestjs/mapped-types';
import { CreateTagResumeDto } from './create-tag-resume.dto';

export class UpdateTagResumeDto extends PartialType(CreateTagResumeDto) {}
