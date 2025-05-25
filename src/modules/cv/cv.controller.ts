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
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Post()
  @UseInterceptors(FileInterceptor('cv'))
  create(
    @UploadedFile()
    cv: Express.Multer.File,
    @Req() req,
  ) {
    const candidateId = req.user.id;
    return this.cvService.create(cv, candidateId);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.CANDIDATE)
  @Get('me')
  findAll(@Req() req) {
    const candidateId = req.user.id;
    return this.cvService.findAllByUserId(candidateId);
  }
}
