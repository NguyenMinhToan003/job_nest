import { Module, OnModuleInit } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { ExperienceController } from './experience.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Experience } from './entities/experience.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Experience])],
  controllers: [ExperienceController],
  providers: [ExperienceService],
})
export class ExperienceModule implements OnModuleInit {
  constructor(private readonly experienceService: ExperienceService) {}

  onModuleInit() {
    this.experienceService.createDefaultExperience();
  }
}
