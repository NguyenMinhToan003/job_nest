import { Controller, Delete, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Get('me')
  getAll(@Req() req) {
    const candidateId = req.user.id;
    return this.resumeService.getAll(candidateId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Delete(':resumeId')
  delete(@Req() req, @Param('resumeId') resumeId: number) {
    const candidateId = req.user.id;
    return this.resumeService.delete(candidateId, +resumeId);
  }
}
