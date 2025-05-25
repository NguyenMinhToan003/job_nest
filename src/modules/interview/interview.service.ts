import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Interview } from './entities/interview.entity';
import { In, Repository } from 'typeorm';
import axios from 'axios';
import { INTERVIEW_STATUS, PROVIDER_LIST } from 'src/types/enum';
import { AccountService } from '../account/account.service';
import { AuthTokenService } from '../auth_token/auth_token.service';

@Injectable()
export class InterviewService {
  constructor(
    @InjectRepository(Interview)
    private readonly interviewRepository: Repository<Interview>,
    private accountService: AccountService,
    private authTokenService: AuthTokenService,
  ) {}
  async create(dto: CreateInterviewDto) {
    const employer = await this.accountService.findCandidateWhere({
      id: dto.employerId,
    });
    if (!employer) {
      throw new NotFoundException('not found employer');
    }
    const token = await this.authTokenService.findByAccountIdAndProvider(
      +employer[0].id,
      PROVIDER_LIST.GOOGLE,
    );
    const candidates = await this.accountService.findCandidateWhere({
      id: In(dto.candidates),
    });
    if (!candidates || candidates.length === 0) {
      throw new NotFoundException('No candidates found for the interview');
    }
    const candidateEmails = candidates.map((c) => {
      return { email: c.email };
    });
    try {
      const timeStart = new Date(dto.interviewTime);
      const { data } = await axios.post(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          summary: dto.summary,
          description: dto.description,
          start: {
            dateTime: timeStart.toISOString(),
            timeZone: 'Asia/Ho_Chi_Minh',
          },
          end: {
            dateTime: new Date(
              timeStart.getTime() + dto.duration * 60 * 1000,
            ).toISOString(),
            timeZone: 'Asia/Ho_Chi_Minh',
          },
          attendees: candidateEmails,
        },
        {
          headers: {
            Authorization: `Bearer ${token.accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      console.log(candidates.map((c) => ({ id: c.id })));
      await this.interviewRepository.save({
        interviewTime: timeStart,
        duration: dto.duration,
        summary: dto.summary,
        description: dto.description,
        candidate: candidates.map((c) => ({ id: c.id })),
        status: INTERVIEW_STATUS.PENDING,
        feedback: null,
        googleCalendarEventId: data.id,
        meetingLink: data.htmlLink,
        calendarId: data.calendarId,
        employer: { id: dto.employerId },
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return data;
    } catch (error) {
      console.log('Error creating interview:', error);
      throw new Error(`Error creating interview: ${error.message}`);
    }
  }
}
