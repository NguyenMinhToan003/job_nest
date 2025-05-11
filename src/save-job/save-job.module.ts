import { Module } from '@nestjs/common';
import { SaveJobService } from './save-job.service';
import { SaveJobController } from './save-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaveJob } from './entities/save-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaveJob])],
  controllers: [SaveJobController],
  providers: [SaveJobService],
})
export class SaveJobModule {}
