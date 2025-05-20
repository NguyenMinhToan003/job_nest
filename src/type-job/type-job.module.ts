import { Module, OnModuleInit } from '@nestjs/common';
import { TypeJobService } from './type-job.service';
import { TypeJobController } from './type-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeJob } from './entities/type-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeJob])],
  controllers: [TypeJobController],
  providers: [TypeJobService],
})
export class TypeJobModule implements OnModuleInit {
  constructor(private readonly typeJobService: TypeJobService) {}

  onModuleInit() {
    this.typeJobService.createDefaultTypeJob();
  }
}
