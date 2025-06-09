import { Controller } from '@nestjs/common';
import { ViewJobService } from './view-job.service';

@Controller('view-job')
export class ViewJobController {
  constructor(private readonly viewJobService: ViewJobService) {}
}
