import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { CvService } from './cv.service';
import { UpdateCvDto } from './dto/update-cv.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateCvDto } from './dto/create-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'cv', maxCount: 1 },
      { name: 'background', maxCount: 1 },
    ]),
  )
  create(
    @UploadedFiles()
    files: {
      cv?: Express.Multer.File[];
      background?: Express.Multer.File[];
    },
    @Body() createCvDto: CreateCvDto,
  ) {
    return this.cvService.create(files, createCvDto);
  }
}
