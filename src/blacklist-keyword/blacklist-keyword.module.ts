import { Module } from '@nestjs/common';
import { BlacklistKeywordService } from './blacklist-keyword.service';
import { BlacklistKeywordController } from './blacklist-keyword.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlacklistKeyword } from './entities/blacklist-keyword.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BlacklistKeyword])],
  controllers: [BlacklistKeywordController],
  providers: [BlacklistKeywordService],
  exports: [BlacklistKeywordService],
})
export class BlacklistKeywordModule {}
