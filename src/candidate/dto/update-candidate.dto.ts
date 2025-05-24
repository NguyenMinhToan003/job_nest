import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-candidate.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
