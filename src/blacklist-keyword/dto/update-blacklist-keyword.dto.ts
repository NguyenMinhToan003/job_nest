import { PartialType } from '@nestjs/mapped-types';
import { CreateBlacklistKeywordDto } from './create-blacklist-keyword.dto';

export class UpdateBlacklistKeywordDto extends PartialType(
  CreateBlacklistKeywordDto,
) {}
