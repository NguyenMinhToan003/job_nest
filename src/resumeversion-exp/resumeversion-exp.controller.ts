import { Controller } from '@nestjs/common';
import { ResumeversionExpService } from './resumeversion-exp.service';

@Controller('resumeversion-exp')
export class ResumeversionExpController {
  constructor(
    private readonly resumeversionExpService: ResumeversionExpService,
  ) {}
}
