import { Injectable, Logger } from '@nestjs/common';
import { FieldService } from '../modules/field/field.service';
import { MajorService } from '../modules/major/major.service';
import { LevelService } from '../modules/level/level.service';
import { SkillService } from '../modules/skill/skill.service';
import { BenefitService } from '../modules/benefit/benefit.service';
import { ExperienceService } from '../modules/experience/experience.service';
import { TypeJobService } from '../modules/type-job/type-job.service';
import { AdminService } from '../modules/admin/admin.service';
import { CityService } from '../modules/city/city.service';
import { DistrictService } from '../modules/district/district.service';
import { EducationService } from 'src/modules/education/education.service';
import { LanguageService } from 'src/modules/language/language.service';
import { BlacklistKeywordService } from 'src/blacklist-keyword/blacklist-keyword.service';
import { PackagesService } from 'src/packages/packages.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly fieldService: FieldService,
    private readonly majorService: MajorService,
    private readonly levelService: LevelService,
    private readonly skillService: SkillService,
    private readonly benefitService: BenefitService,
    private readonly experienceService: ExperienceService,
    private readonly typeJobService: TypeJobService,
    private readonly adminService: AdminService,
    private readonly cityService: CityService,
    private readonly districtService: DistrictService,
    private readonly educationService: EducationService,
    private readonly languageService: LanguageService,
    private readonly blacklistKeywordService: BlacklistKeywordService,
    private readonly packagesService: PackagesService,
  ) {}

  private readonly logger = new Logger(SeedService.name);

  async runAllSeeds() {
    try {
      this.logger.log('🌱 Bắt đầu seed dữ liệu...');

      await this.fieldService.createDefaultFields();
      this.logger.log(`✅ Đã seed field`);

      await this.majorService.createDefaultMajors();
      this.logger.log(`✅ Đã seed major`);

      await this.levelService.createDefaultLevel();
      this.logger.log(`✅ Đã seed level`);

      await this.skillService.createDefaultSkills();
      this.logger.log(`✅ Đã seed skill`);

      await this.benefitService.createDefaultBenefits();
      this.logger.log(`✅ Đã seed benefit`);

      await this.experienceService.createDefaultExperience();
      this.logger.log(`✅ Đã seed experience`);

      await this.typeJobService.createDefaultTypeJob();
      this.logger.log(`✅ Đã seed type job`);

      await this.adminService.createAdminDefault();
      this.logger.log(`✅ Đã seed admin`);

      await this.cityService.fetchAll();
      this.logger.log(`✅ Đã seed city`);
      await this.districtService.fetchAll();
      this.logger.log(`✅ Đã seed district`);

      await this.educationService.createDefaultEducation();
      this.logger.log(`✅ Đã seed education`);

      await this.languageService.createDefaultLanguages();
      this.logger.log(`✅ Đã seed language`);

      await this.blacklistKeywordService.createDefaultKeywords();
      this.logger.log(`✅ Đã seed blacklist keywords`);

      await this.packagesService.createDefaultPackages();
      this.logger.log(`✅ Đã seed packages`);

      this.logger.log('🌿 Hoàn tất seed dữ liệu!');
    } catch (error) {
      this.logger.error('❌ Seed thất bại:', error);
      throw error;
    }
  }
}
