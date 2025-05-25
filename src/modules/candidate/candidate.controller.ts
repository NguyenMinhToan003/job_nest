import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { UpdateUserDto } from './dto/update-candidate.dto';

@Controller('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get('me')
  async getMe(@Req() req) {
    const candidateId = req.user.id;
    return await this.candidateService.getMe(candidateId);
  }

  @Patch('me')
  async updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    const candidateId = req.user.id;
    return await this.candidateService.updateMe(candidateId, dto);
  }
}
