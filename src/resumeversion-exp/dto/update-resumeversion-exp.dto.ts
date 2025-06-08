import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeversionExpDto } from './create-resumeversion-exp.dto';

export class UpdateResumeversionExpDto extends PartialType(
  CreateResumeversionExpDto,
) {}
