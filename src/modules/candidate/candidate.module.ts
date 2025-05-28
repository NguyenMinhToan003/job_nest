import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Candidate } from './entities/candidate.entity';
import { CandidateController } from './candidate.controller';
import { CandidateService } from './candidate.service';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [UploadModule, TypeOrmModule.forFeature([Candidate])],
  controllers: [CandidateController],
  providers: [CandidateService],
  exports: [CandidateService],
})
export class CandidateModule {}
