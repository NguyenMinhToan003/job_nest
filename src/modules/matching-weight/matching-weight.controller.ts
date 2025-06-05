import { Controller } from '@nestjs/common';
import { MatchingWeightService } from './matching-weight.service';

@Controller('matching-weight')
export class MatchingWeightController {
  constructor(private readonly matchingWeightService: MatchingWeightService) {}
}
