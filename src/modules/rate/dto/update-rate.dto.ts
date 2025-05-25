import { PartialType } from '@nestjs/mapped-types';
import { CreateRateDto } from './create-rate.dto';

export class UpdateRateDto extends PartialType(CreateRateDto) {}
