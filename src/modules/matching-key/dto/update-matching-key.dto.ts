import { PartialType } from '@nestjs/mapped-types';
import { CreateMatchingKeyDto } from './create-matching-key.dto';

export class UpdateMatchingKeyDto extends PartialType(CreateMatchingKeyDto) {}
