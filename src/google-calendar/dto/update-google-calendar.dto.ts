import { PartialType } from '@nestjs/mapped-types';
import { CreateGoogleCalendarDto } from './create-google-calendar.dto';

export class UpdateGoogleCalendarDto extends PartialType(
  CreateGoogleCalendarDto,
) {}
