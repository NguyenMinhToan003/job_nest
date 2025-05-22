import {
  Controller,
  Post,
  UseInterceptors,
  UseGuards,
  Req,
  Get,
  UploadedFile,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { ROLE_LIST, Roles } from 'src/decorators/customize';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.USER)
  @Post()
  @UseInterceptors(FileInterceptor('cv'))
  create(
    @UploadedFile()
    cv: Express.Multer.File,
    @Req() req,
  ) {
    const userId = req.user.id;
    return this.cvService.create(cv, userId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.USER)
  @Get('me')
  findAll(@Req() req) {
    const userId = req.user.id;
    return this.cvService.findAllByUserId(userId);
  }
}
