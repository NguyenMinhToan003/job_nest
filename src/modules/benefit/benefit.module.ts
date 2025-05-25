import { Module, OnModuleInit } from '@nestjs/common';
import { BenefitService } from './benefit.service';
import { BenefitController } from './benefit.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Benefit } from './entities/benefit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Benefit])],
  controllers: [BenefitController],
  providers: [BenefitService],
})
export class BenefitModule implements OnModuleInit {
  constructor(private readonly benefitService: BenefitService) {}
  onModuleInit() {
    this.benefitService.createDefaultBenefits();
  }
}
