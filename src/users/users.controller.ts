import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAccountDto, LoginDto } from 'src/account/dto/create-account.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createAccountDto: CreateAccountDto) {
    return await this.usersService.register(createAccountDto);
  }
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.usersService.login(loginDto);
  }
}
