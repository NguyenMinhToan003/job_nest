import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  Get,
  Delete,
} from '@nestjs/common';
import { SaveJobService } from './save-job.service';
import { CreateSaveJobDto } from './dto/create-save-job.dto';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';

@Controller('save-job')
export class SaveJobController {
  constructor(private readonly saveJobService: SaveJobService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Post()
  create(@Req() req, @Body() createSaveJobDto: CreateSaveJobDto) {
    const candidateId = req.user.id;
    return this.saveJobService.create(candidateId, createSaveJobDto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Post('me/:page/:limit')
  getMe(
    @Req() req,
    @Param('page') page: number,
    @Param('limit') limit: number,
  ) {
    const candidateId = req.user.id;
    return this.saveJobService.getMe(candidateId, page, limit);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Get('recommended')
  getRecomended(@Req() req) {
    const candidateId = req.user.id;
    return this.saveJobService.getRecomended(candidateId);
  }
  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Delete(':jobId')
  delete(@Req() req, @Param('jobId') jobId: number) {
    const candidateId = req.user.id;
    return this.saveJobService.delete(candidateId, jobId);
  }
}
