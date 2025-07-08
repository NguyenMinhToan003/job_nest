import { Module } from '@nestjs/common';
import { EmployerScalesService } from './employer-scales.service';
import { EmployerScalesController } from './employer-scales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerScale } from './entities/employer-scale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployerScale])],
  controllers: [EmployerScalesController],
  providers: [EmployerScalesService],
  exports: [EmployerScalesService],
})
export class EmployerScalesModule {}
