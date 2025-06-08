import { Module } from '@nestjs/common';
import { ResumeversionExpService } from './resumeversion-exp.service';
import { ResumeversionExpController } from './resumeversion-exp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeversionExp } from './entities/resumeversion-exp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ResumeversionExp])],
  controllers: [ResumeversionExpController],
  providers: [ResumeversionExpService],
  exports: [ResumeversionExpService],
})
export class ResumeversionExpModule {}
