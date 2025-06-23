import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TagResumeService } from './tag-resume.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';
import { CreateTagResumeDto } from './dto/create-tag-resume.dto';

@Controller('tag-resume')
export class TagResumeController {
  constructor(private readonly tagResumeService: TagResumeService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Post('')
  createTagResume(@Req() req, @Body() body: CreateTagResumeDto) {
    const employerId = req.user.id;
    return this.tagResumeService.createTagResume(employerId, body);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Get('')
  getAllTagResume(@Req() req) {
    const employerId = req.user.id;
    return this.tagResumeService.getAllTagResume(employerId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Delete(':id')
  deleteTagResume(@Req() req, @Body('id') id: number) {
    const employerId = req.user.id;
    return this.tagResumeService.deleteTagResume(employerId, id);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Patch(':id')
  updateTagResume(@Req() req, @Body() body: CreateTagResumeDto) {
    const employerId = req.user.id;
    const tagId = Number(req.params.id);
    return this.tagResumeService.updateTagResume(employerId, tagId, body);
  }
}
