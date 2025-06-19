import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployerScaleDto } from './create-employer-scale.dto';

export class UpdateEmployerScaleDto extends PartialType(
  CreateEmployerScaleDto,
) {}
