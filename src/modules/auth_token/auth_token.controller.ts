import { Controller } from '@nestjs/common';
import { AuthTokenService } from './auth_token.service';

@Controller('auth-token')
export class AuthTokenController {
  constructor(private readonly authTokenService: AuthTokenService) {}
}
