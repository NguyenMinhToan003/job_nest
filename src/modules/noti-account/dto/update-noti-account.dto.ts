import { PartialType } from '@nestjs/mapped-types';
import { CreateNotiAccountDto } from './create-noti-account.dto';

export class UpdateNotiAccountDto extends PartialType(CreateNotiAccountDto) {}
