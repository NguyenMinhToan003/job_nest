import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployerController } from './employer.controller';
import { EmployerService } from './employer.service';
import { Employer } from './entities/employer.entity';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [LocationModule, TypeOrmModule.forFeature([Employer])],
  controllers: [EmployerController],
  providers: [EmployerService],
  exports: [EmployerService],
})
export class EmployerModule {}
