import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './modules/account/account.module';
import { AdminModule } from './modules/admin/admin.module';
import { EmployerModule } from './modules/employer/employer.module';
import { JobModule } from './modules/job/job.module';
import { SkillModule } from './modules/skill/skill.module';
import { DistrictModule } from './modules/district/district.module';
import { CityModule } from './modules/city/city.module';
import { CountryModule } from './modules/country/country.module';
import { SaveJobModule } from './modules/save-job/save-job.module';
import { ApplyJobModule } from './modules/apply-job/apply-job.module';
import { FollowModule } from './modules/follow/follow.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { TypeJobModule } from './modules/type-job/type-job.module';
import { BenefitModule } from './modules/benefit/benefit.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { CandidateModule } from './modules/candidate/candidate.module';
import { LocationModule } from './modules/location/location.module';
import { MajorModule } from './modules/major/major.module';
import { LevelModule } from './modules/level/level.module';
import { NotiAccountModule } from './modules/noti-account/noti-account.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { FieldModule } from './modules/field/field.module';
import { SeedModule } from './seed/seed.module';
import { EducationModule } from './modules/education/education.module';
import { ResumeModule } from './modules/resume/resume.module';
import { ResumeVersionModule } from './modules/resume-version/resume-version.module';
import { LanguageResumeModule } from './modules/language-resume/language-resume.module';
import { LanguageModule } from './modules/language/language.module';
import { LanguageJobModule } from './modules/language-job/language-job.module';
import { MatchingWeightModule } from './modules/matching-weight/matching-weight.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronJobModule } from './cronjob/cron-job.module';
import { ViewJobModule } from './modules/view-job/view-job.module';
import { PackagesModule } from './modules/packages/packages.module';
import { EmployerSubscriptionsModule } from './modules/employer_subscriptions/employer_subscriptions.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { EmployerScalesModule } from './modules/employer-scales/employer-scales.module';
import { BusinessTypeModule } from './modules/business-type/business-type.module';
import { PaymentModule } from './payment/payment.module';
import { TagResumeModule } from './modules/tag-resume/tag-resume.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: +process.env.MYSQL_PORT,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DBNAME,
        charset: 'utf8mb4_general_ci',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: configService.get<number>('MAIL_PORT'),
          secure: true,
          ignoreTLS: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: 'tuyendung123@gmail.com',
        },
        preview: false,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    AccountModule,
    CandidateModule,
    AdminModule,
    EmployerModule,
    SeedModule,
    JobModule,
    SkillModule,
    LocationModule,
    DistrictModule,
    CityModule,
    CountryModule,
    MajorModule,
    LevelModule,
    SaveJobModule,
    ApplyJobModule,
    FollowModule,
    UploadModule,
    ExperienceModule,
    TypeJobModule,
    BenefitModule,
    AuthModule,
    NotiAccountModule,
    FieldModule,
    EducationModule,
    ResumeModule,
    ResumeVersionModule,
    LanguageResumeModule,
    LanguageModule,
    LanguageJobModule,
    MatchingWeightModule,
    ViewJobModule,
    PackagesModule,
    EmployerSubscriptionsModule,
    TransactionModule,
    EmployerScalesModule,
    BusinessTypeModule,
    PaymentModule,
    TagResumeModule,
    CronJobModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
