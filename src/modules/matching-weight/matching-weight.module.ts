import { Module } from '@nestjs/common';
import { MatchingWeightService } from './matching-weight.service';
import { MatchingWeightController } from './matching-weight.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchingWeight } from './entities/matching-weight.entity';
import { MatchingKeyModule } from '../matching-key/matching-key.module';

@Module({
  imports: [MatchingKeyModule, TypeOrmModule.forFeature([MatchingWeight])],
  controllers: [MatchingWeightController],
  providers: [MatchingWeightService],
  exports: [MatchingWeightService],
})
export class MatchingWeightModule {}
