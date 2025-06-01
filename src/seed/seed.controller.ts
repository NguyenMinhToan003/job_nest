import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Public } from 'src/decorators/customize';
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Public()
  @Post('run')
  async runSeed() {
    return this.seedService.runAllSeeds();
  }
}
