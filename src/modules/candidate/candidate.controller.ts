import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { UpdateUserDto } from './dto/update-candidate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';
import { AdminFilterCandidateDto } from './dto/create-candidate.dto';

@Controller('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get('me')
  async getMe(@Req() req) {
    const candidateId = req.user.id;
    return await this.candidateService.getMe(candidateId);
  }

  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateMe(
    @UploadedFile() avatar: Express.Multer.File,
    @Req() req,
    @Body() dto: UpdateUserDto,
  ) {
    const candidateId = req.user.id;
    return await this.candidateService.updateMe(candidateId, dto, avatar);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Get('all')
  async getAllCandidates(@Query() query: AdminFilterCandidateDto) {
    return await this.candidateService.getAllCandidates(query);
  }
}
