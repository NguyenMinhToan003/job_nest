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
import { CountryService } from 'src/modules/country/country.service';
import { PackagesService } from 'src/modules/packages/packages.service';
import { BusinessTypeService } from 'src/modules/business-type/business-type.service';
import { EmployerScalesService } from 'src/modules/employer-scales/employer-scales.service';

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
    private readonly packagesService: PackagesService,
    private readonly businessTypeService: BusinessTypeService,
    private readonly employerScalesService: EmployerScalesService,
    private readonly countryService: CountryService,
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

      await this.packagesService.createDefaultPackages();
      this.logger.log(`✅ Đã seed packages`);

      await this.businessTypeService.createDefaultBusinessTypes();
      this.logger.log(`✅ Đã seed business types`);
      await this.employerScalesService.createDefaultEmployerScales();
      this.logger.log(`✅ Đã seed employer scales`);
      await this.countryService.createDefaultCountries();
      this.logger.log(`✅ Đã seed countries`);

      this.logger.log('🌿 Hoàn tất seed dữ liệu!');
    } catch (error) {
      this.logger.error('❌ Seed thất bại:', error);
      throw error;
    }
  }
}
