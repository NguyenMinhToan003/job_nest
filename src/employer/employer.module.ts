import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountModule } from 'src/account/account.module';
import { AuthModule } from 'src/auth/auth.module';
import { LocationModule } from 'src/location/location.module';
import { EmployerController } from './employer.controller';
import { EmployerService } from './employer.service';
import { Employer } from './entities/employer.entity';

@Module({
  imports: [
    LocationModule,
    AuthModule,
    AccountModule,
    TypeOrmModule.forFeature([Employer]),
  ],
  controllers: [EmployerController],
  providers: [EmployerService],
})
export class EmployerModule {}
