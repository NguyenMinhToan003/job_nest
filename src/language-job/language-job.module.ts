import { Module } from '@nestjs/common';
import { LanguageJobService } from './language-job.service';
import { LanguageJobController } from './language-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LanguageJob } from './entities/language-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LanguageJob])],
  controllers: [LanguageJobController],
  providers: [LanguageJobService],
  exports: [LanguageJobService],
})
export class LanguageJobModule {}
