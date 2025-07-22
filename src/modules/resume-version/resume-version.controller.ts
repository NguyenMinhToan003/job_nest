import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import { Public, Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';
import {
  CreateResumeVersionDto,
  QueryDto,
} from './dto/create-resume-version.dto';
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
    if (!files.cv) {
      throw new BadRequestException(
        'Vui lòng tải lên đầy đủ ảnh đại diện & CV',
      );
    }
    const candidateId = req.user.id;
    const resume = await this.resumeService.create(candidateId, dto.name);
    try {
      const resumeVer = await this.resumeVersionService.create(
        dto,
        files,
        +resume.id,
      );
      return resumeVer;
    } catch (err: any) {
      await this.resumeService.deleteWhenError(candidateId, +resume.id);
      console.error('Error creating resume version:', err);
      throw new BadRequestException(
        'Đã sảy ra lỗi khi khởi tạo hồ sơ công việc',
      );
    }
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
    return this.resumeVersionService.update(candidateId, files, +resumeId, dto);
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

  @Public()
  @Get('active-default/:candidateId')
  getActiveDefaultResume(@Param('candidateId') candidateId: number) {
    return this.resumeVersionService.getActiveDefaultResume(+candidateId);
  }

  @Public()
  @Post('search')
  async search(@Body() query: QueryDto) {
    return this.resumeVersionService.search(query);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.ADMIN)
  @Delete('cron-job/delete-draft')
  async deleteDraft() {
    return this.resumeVersionService.deleteVersionDraft();
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'cv',
        maxCount: 1,
      },
    ]),
  )
  @Patch('upload-new-cv/:resumeId')
  async uploadNewCV(
    @Req() req,
    @Param('resumeId') resumeId: number,
    @UploadedFiles()
    files: {
      cv?: Express.Multer.File[] | null;
    },
  ) {
    if (!files.cv || files.cv.length === 0) {
      throw new BadRequestException('Vui lòng tải lên CV mới');
    }
    const candidateId = req.user.id;
    return this.resumeVersionService.uploadNewCV(
      candidateId,
      resumeId,
      files.cv[0],
    );
  }
}
