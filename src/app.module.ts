import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { AdminModule } from './admin/admin.module';
import { EmployerModule } from './employer/employer.module';
import { CvModule } from './cv/cv.module';
import { JobModule } from './job/job.module';
import { SkillModule } from './skill/skill.module';
import { LocationModule } from './location/location.module';
import { DistrictModule } from './district/district.module';
import { CityModule } from './city/city.module';
import { CountryModule } from './country/country.module';
import { MajorModule } from './major/major.module';
import { PostModule } from './post/post.module';
import { NotiSettingModule } from './noti-setting/noti-setting.module';
import { LevelModule } from './level/level.module';
import { SaveJobModule } from './save-job/save-job.module';
import { ApplyJobModule } from './apply-job/apply-job.module';
import { FollowModule } from './follow/follow.module';
import { RateModule } from './rate/rate.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { ExperienceModule } from './experience/experience.module';
import { TypeJobModule } from './type-job/type-job.module';
import { BenefitModule } from './benefit/benefit.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { InterviewModule } from './interview/interview.module';
import { CandidateModule } from './candidate/candidate.module';

@Module({
  imports: [
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
    AccountModule,
    CandidateModule,
    AdminModule,
    EmployerModule,
    CvModule,
    JobModule,
    SkillModule,
    LocationModule,
    DistrictModule,
    CityModule,
    CountryModule,
    MajorModule,
    PostModule,
    NotiSettingModule,
    LevelModule,
    SaveJobModule,
    ApplyJobModule,
    FollowModule,
    RateModule,
    UploadModule,
    ExperienceModule,
    TypeJobModule,
    BenefitModule,
    AuthModule,
    InterviewModule,
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
