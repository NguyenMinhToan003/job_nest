import { Controller } from '@nestjs/common';
import { MatchingKeyService } from './matching-key.service';

@Controller('matching-key')
export class MatchingKeyController {
  constructor(private readonly matchingKeyService: MatchingKeyService) {}
}
