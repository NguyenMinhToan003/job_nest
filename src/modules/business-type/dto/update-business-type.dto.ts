import { PartialType } from '@nestjs/mapped-types';
import { CreateBusinessTypeDto } from './create-business-type.dto';

export class UpdateBusinessTypeDto extends PartialType(CreateBusinessTypeDto) {}
