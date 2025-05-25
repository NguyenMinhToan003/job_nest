import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthTokenDto } from './create-auth_token.dto';

export class UpdateAuthTokenDto extends PartialType(CreateAuthTokenDto) {}
