// auth_token.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthToken } from './entities/auth_token.entity';
import { Repository } from 'typeorm';
import { CreateAuthTokenDto } from './dto/create-auth_token.dto';
import { PROVIDER_LIST } from 'src/types/enum';

@Injectable()
export class AuthTokenService {
  constructor(
    @InjectRepository(AuthToken)
    private readonly authTokenRepository: Repository<AuthToken>,
  ) {}

  async create(dto: CreateAuthTokenDto) {
    const authToken = this.authTokenRepository.create({
      accessToken: dto.accessToken,
      refreshToken: dto.refreshToken,
      tokenExpiry: dto.tokenExpiry || null,
      provider: dto.provider || PROVIDER_LIST.GOOGLE,
      account: { id: dto.accountId },
      accountId: dto.accountId,
    });
    return this.authTokenRepository.save(authToken);
  }

  async update(
    accountId: number,
    provider: PROVIDER_LIST,
    dto: CreateAuthTokenDto,
  ) {
    const authToken = await this.authTokenRepository.findOne({
      where: { accountId, provider },
    });

    if (!authToken) {
      return this.create({
        ...dto,
        accountId,
        provider,
      });
    }

    // Cập nhật token
    authToken.accessToken = dto.accessToken;
    authToken.refreshToken = dto.refreshToken || authToken.refreshToken;
    authToken.tokenExpiry = dto.tokenExpiry || authToken.tokenExpiry;
    return this.authTokenRepository.save(authToken);
  }
  async findByAccountIdAndProvider(accountId: number, provider: PROVIDER_LIST) {
    return this.authTokenRepository.findOne({
      where: { accountId, provider },
    });
  }
}
