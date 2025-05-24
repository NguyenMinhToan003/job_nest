import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateUserDto } from './dto/create-candidate.dto';
import { Public } from 'src/decorators/customize';
import { CandidateService } from './candidate.service';

@Controller('users')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    return await this.candidateService.register(dto);
  }

  @Get('me')
  async getMe(@Req() req) {
    const userId = req.user.id;
    return await this.candidateService.getMe(userId);
  }
}
