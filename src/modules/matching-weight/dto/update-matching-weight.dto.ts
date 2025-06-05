import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchingWeightDto } from './create-matching-weight.dto';

export class UpdateMatchingWeightDto extends PartialType(
  CreateMatchingWeightDto,
) {}
