import { Controller } from '@nestjs/common';
import { BlacklistKeywordService } from './blacklist-keyword.service';

@Controller('blacklist-keyword')
export class BlacklistKeywordController {
  constructor(
    private readonly blacklistKeywordService: BlacklistKeywordService,
  ) {}
}
