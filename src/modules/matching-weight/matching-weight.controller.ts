import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MatchingWeightService } from './matching-weight.service';
import { RolesGuard } from 'src/auth/passport/role.guard';
import { Roles } from 'src/decorators/customize';
import { ROLE_LIST } from 'src/types/enum';
import { CreateMatchingWeightDto } from './dto/create-matching-weight.dto';
import { UpdateMatchingWeightDto } from './dto/update-matching-weight.dto';

@Controller('matching-weight')
export class MatchingWeightController {
  constructor(private readonly matchingWeightService: MatchingWeightService) {}

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Post('trigger-job-create/:jobId')
  async triggerJobCreate(
    @Param('jobId') jobId: number,
    @Body() dto: CreateMatchingWeightDto,
  ) {
    return this.matchingWeightService.triggerJobCreate(jobId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE_LIST.EMPLOYER)
  @Patch(':jobId')
  async updateMatchingWeight(
    @Param('jobId') jobId: number,
    @Body() dto: UpdateMatchingWeightDto,
  ) {
    return this.matchingWeightService.updateMatchingWeight(jobId, dto);
  }
}
