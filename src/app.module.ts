import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './modules/account/account.module';
import { AdminModule } from './modules/admin/admin.module';
import { EmployerModule } from './modules/employer/employer.module';
import { CvModule } from './modules/cv/cv.module';
import { JobModule } from './modules/job/job.module';
import { SkillModule } from './modules/skill/skill.module';
import { DistrictModule } from './modules/district/district.module';
import { CityModule } from './modules/city/city.module';
import { CountryModule } from './modules/country/country.module';
import { PostModule } from './modules/post/post.module';
import { NotiSettingModule } from './modules/noti-setting/noti-setting.module';
import { SaveJobModule } from './modules/save-job/save-job.module';
import { ApplyJobModule } from './modules/apply-job/apply-job.module';
import { FollowModule } from './modules/follow/follow.module';
import { RateModule } from './modules/rate/rate.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.module';
import { ExperienceModule } from './modules/experience/experience.module';
import { TypeJobModule } from './modules/type-job/type-job.module';
import { BenefitModule } from './modules/benefit/benefit.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/passport/jwt-auth.guard';
import { InterviewModule } from './modules/interview/interview.module';
import { CandidateModule } from './modules/candidate/candidate.module';
import { LocationModule } from './modules/location/location.module';
import { MajorModule } from './modules/major/major.module';
import { LevelModule } from './modules/level/level.module';
import { GoogleCalendarModule } from './google-calendar/google-calendar.module';
import { AuthTokenModule } from './modules/auth_token/auth_token.module';
import { GetwayModule } from './getway/getway.module';
import { NotiAccountModule } from './modules/noti-account/noti-account.module';
import { RoomchatModule } from './modules/roomchat/roomchat.module';
import { MessagesModule } from './modules/messages/messages.module';

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
    GoogleCalendarModule,
    AuthTokenModule,
    GetwayModule,
    NotiAccountModule,
    RoomchatModule,
    MessagesModule,
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
