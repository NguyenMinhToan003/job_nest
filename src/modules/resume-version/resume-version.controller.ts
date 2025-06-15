import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ResumeVersionService } from './resume-version.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';
import { CreateResumeVersionDto } from './dto/create-resume-version.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ResumeService } from '../resume/resume.service';

@Controller('resume-version')
export class ResumeVersionController {
  constructor(
    private readonly resumeVersionService: ResumeVersionService,
    private readonly resumeService: ResumeService,
  ) {}

  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cv', maxCount: 1 },
    ]),
  )
  @Roles(ROLE_LIST.CANDIDATE)
  @Post('init')
  async init(
    @Req() req,
    @Body() dto: CreateResumeVersionDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[] | null;
      cv?: Express.Multer.File[] | null;
    },
  ) {
    const candidateId = req.user.id;
    const resume = await this.resumeService.create(candidateId, dto.name);
    return this.resumeVersionService.create(dto, files, +resume.id);
  }

  @UseGuards(RolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'cv', maxCount: 1 },
    ]),
  )
  @Roles(ROLE_LIST.CANDIDATE)
  @Patch(':resumeId')
  update(
    @Req() req,
    @Body() dto: CreateResumeVersionDto,
    @Param('resumeId') resumeId: number,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[] | null;
      cv?: Express.Multer.File[] | null;
    },
  ) {
    const candidateId = req.user.id;
    return this.resumeVersionService.update(candidateId, dto, files, +resumeId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Get('me')
  getMe(@Req() req) {
    const candidateId = req.user.id;
    return this.resumeVersionService.getMe(+candidateId);
  }

  @Get(':resumeId')
  getOne(@Param('resumeId') resumeId: number) {
    return this.resumeVersionService.viewVersion(resumeId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Get('view/:resumeId')
  viewResume(@Req() req, @Param('resumeId') resumeId: number) {
    const candidateId = req.user.id;
    return this.resumeVersionService.viewResume(candidateId, resumeId);
  }
}
