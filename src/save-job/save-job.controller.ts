import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { SaveJobService } from './save-job.service';
import { CreateSaveJobDto } from './dto/create-save-job.dto';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { ROLE_LIST, Roles } from 'src/decorators/customize';

@Controller('save-job')
export class SaveJobController {
  constructor(private readonly saveJobService: SaveJobService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.USER)
  @Post()
  create(@Req() req, @Body() createSaveJobDto: CreateSaveJobDto) {
    const userId = req.user.id;
    console.log('userId', createSaveJobDto);
    return this.saveJobService.create(userId, createSaveJobDto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.USER)
  @Post('me')
  getMe(@Req() req) {
    const userId = req.user.id;
    return this.saveJobService.getMe(userId);
  }
}
