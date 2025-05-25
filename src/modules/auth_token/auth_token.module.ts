import { Module } from '@nestjs/common';
import { AuthTokenService } from './auth_token.service';
import { AuthTokenController } from './auth_token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthToken } from './entities/auth_token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthToken])],
  controllers: [AuthTokenController],
  providers: [AuthTokenService],
  exports: [AuthTokenService],
})
export class AuthTokenModule {}
