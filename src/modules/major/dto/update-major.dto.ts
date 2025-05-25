import { PartialType } from '@nestjs/mapped-types';
import { CreateMajorDto } from './create-major.dto';

export class UpdateMajorDto extends PartialType(CreateMajorDto) {}
