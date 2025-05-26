import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployerNotiDto } from './create-employer-noti.dto';

export class UpdateEmployerNotiDto extends PartialType(CreateEmployerNotiDto) {}
