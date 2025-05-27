import { Module } from '@nestjs/common';
import { InterviewService } from './interview.service';
import { InterviewController } from './interview.controller';
import { AccountModule } from '../account/account.module';
import { AuthTokenModule } from '../auth_token/auth_token.module';
import { Interview } from './entities/interview.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    AccountModule,
    AuthTokenModule,
    TypeOrmModule.forFeature([Interview]),
  ],
  controllers: [InterviewController],
  providers: [InterviewService],
})
export class InterviewModule {}
