import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/decorators/customize';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return await this.usersService.register(dto);
  }

  @Get('me')
  async getMe(@Req() req) {
    const userId = req.user.id;
    return await this.usersService.getMe(userId);
  }
}
