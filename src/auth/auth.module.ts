import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/jwt.strategy';
import { AccountModule } from 'src/modules/account/account.module';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './passport/google.strategy';
import { CandidateModule } from 'src/modules/candidate/candidate.module';
import { EmployerModule } from 'src/modules/employer/employer.module';
import { UploadModule } from 'src/upload/upload.module';

@Module({
  imports: [
    UploadModule,
    CandidateModule,
    EmployerModule,
    AccountModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
