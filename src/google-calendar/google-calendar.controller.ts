import { Body, Controller, Post } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { Public } from 'src/decorators/customize';

@Controller('google-calendar')
export class GoogleCalendarController {
  constructor(private readonly googleCalendarService: GoogleCalendarService) {}

  @Public()
  @Post()
  setCredentials(
    @Body()
    body: {
      accessToken: string;
      refreshToken: string;
      accountId: number;
    },
  ) {
    const { accessToken, refreshToken, accountId } = body;
    return this.googleCalendarService.setCredentials(
      accessToken,
      refreshToken,
      accountId,
    );
  }

  @Public()
  @Post('create-event')
  createEvent(
    @Body()
    body: {
      event: any;
      calendarId?: string;
    },
  ) {
    const { event, calendarId } = body;
    return this.googleCalendarService.createEvent(event, calendarId);
  }
}
