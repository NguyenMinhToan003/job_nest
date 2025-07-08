import { Module } from '@nestjs/common';
import { FieldModule } from '../modules/field/field.module';
import { MajorModule } from '../modules/major/major.module';
import { LevelModule } from '../modules/level/level.module';
import { SeedService } from './seed.service';
import { SkillModule } from '../modules/skill/skill.module';
import { BenefitModule } from '../modules/benefit/benefit.module';
import { ExperienceModule } from '../modules/experience/experience.module';
import { TypeJobModule } from '../modules/type-job/type-job.module';
import { AdminModule } from '../modules/admin/admin.module';
import { CityModule } from '../modules/city/city.module';
import { DistrictModule } from '../modules/district/district.module';
import { SeedController } from './seed.controller';
import { EducationModule } from 'src/modules/education/education.module';
import { LanguageModule } from 'src/modules/language/language.module';
import { CountryModule } from 'src/modules/country/country.module';
import { BusinessTypeModule } from 'src/modules/business-type/business-type.module';
import { PackagesModule } from 'src/modules/packages/packages.module';
import { EmployerScalesModule } from 'src/modules/employer-scales/employer-scales.module';
@Module({
  imports: [
    FieldModule,
    BusinessTypeModule,
    MajorModule,
    LevelModule,
    CountryModule,
    SkillModule,
    BenefitModule,
    ExperienceModule,
    EducationModule,
    TypeJobModule,
    PackagesModule,
    LanguageModule,
    AdminModule,
    CityModule,
    DistrictModule,
    EmployerScalesModule,
  ],
  controllers: [SeedController],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
