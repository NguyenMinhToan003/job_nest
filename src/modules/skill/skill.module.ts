import { Module, OnModuleInit } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  controllers: [SkillController],
  providers: [SkillService],
})
export class SkillModule implements OnModuleInit {
  constructor(private readonly skillService: SkillService) {}

  onModuleInit() {
    this.skillService.createDefaultSkill();
  }
}
