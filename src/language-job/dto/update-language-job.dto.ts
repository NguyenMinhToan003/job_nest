import { PartialType } from '@nestjs/mapped-types';
import { CreateLanguageJobDto } from './create-language-job.dto';

export class UpdateLanguageJobDto extends PartialType(CreateLanguageJobDto) {}
