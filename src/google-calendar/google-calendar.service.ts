// google-calendar.service.ts
import { Injectable } from '@nestjs/common';
import { calendar_v3 } from '@googleapis/calendar';
import { google } from 'googleapis';
import { AuthTokenService } from 'src/modules/auth_token/auth_token.service';
import { PROVIDER_LIST } from 'src/types/enum';
import { CreateAuthTokenDto } from 'src/modules/auth_token/dto/create-auth_token.dto';

@Injectable()
export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;
  private oauth2Client: any;

  constructor(private authTokenService: AuthTokenService) {
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI,
    );
    this.oauth2Client.on('tokens', async (tokens) => {
      if (tokens.access_token) {
        console.log('[tokens]', tokens);
        // Cập nhật vào DB nếu cần
      }
    });
  }

  // Cập nhật token cho người dùng hiện tại
  setCredentials(accessToken: string, refreshToken: string, accountId: number) {
    this.oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Tự động làm mới token nếu hết hạn
    this.oauth2Client.on('tokens', async (tokens) => {
      console.log(tokens);
      if (tokens.access_token) {
        // Cập nhật access token mới
        await this.authTokenService.update(accountId, PROVIDER_LIST.GOOGLE, {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token || undefined,
          tokenExpiry: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        } as CreateAuthTokenDto);
      }
    });
  }

  async createEvent(
    event: calendar_v3.Schema$Event,
    calendarId: string = 'primary',
  ) {
    const response = await this.calendar.events.insert({
      calendarId,
      requestBody: event,
      conferenceDataVersion: event.conferenceData ? 1 : 0,
    });
    return response.data;
  }

  async updateEvent(
    eventId: string,
    event: calendar_v3.Schema$Event,
    calendarId: string = 'primary',
  ) {
    const response = await this.calendar.events.patch({
      calendarId,
      eventId,
      requestBody: event,
    });
    return response.data;
  }

  async deleteEvent(eventId: string, calendarId: string = 'primary') {
    await this.calendar.events.delete({
      calendarId,
      eventId,
    });
  }
}
