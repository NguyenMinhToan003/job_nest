import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { UpdateUserDto } from './dto/update-candidate.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
}
