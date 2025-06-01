import { Module } from '@nestjs/common';
import { TypeJobService } from './type-job.service';
import { TypeJobController } from './type-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeJob } from './entities/type-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeJob])],
  controllers: [TypeJobController],
  providers: [TypeJobService],
  exports: [TypeJobService],
})
export class TypeJobModule {}
