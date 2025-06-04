import { PartialType } from '@nestjs/mapped-types';
import { CreateLanguageResumeDto } from './create-language-resume.dto';

export class UpdateLanguageResumeDto extends PartialType(
  CreateLanguageResumeDto,
) {}
