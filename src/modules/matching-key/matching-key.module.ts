import { Module } from '@nestjs/common';
import { MatchingKeyService } from './matching-key.service';
import { MatchingKeyController } from './matching-key.controller';
import { MatchingKey } from './entities/matching-key.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MatchingKey])],
  controllers: [MatchingKeyController],
  providers: [MatchingKeyService],
  exports: [MatchingKeyService],
})
export class MatchingKeyModule {}
