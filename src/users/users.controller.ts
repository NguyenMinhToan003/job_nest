import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';
import { Public } from 'src/decorators/customize';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return await this.usersService.register(dto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginUserDto) {
    return await this.usersService.login(loginDto);
  }
}
