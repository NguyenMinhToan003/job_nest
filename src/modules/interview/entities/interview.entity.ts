import { ApplyJob } from 'src/modules/apply-job/entities/apply-job.entity';
import { INTERVIEW_STATUS } from 'src/types/enum';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'phong_van' })
export class Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'thoi_gian_ban_dau',
    type: 'timestamp',
  })
  interviewTime: Date;

  @Column({ name: 'thoi_luong', type: 'int', nullable: true })
  duration: number;

  @Column({ name: 'danh_gia', type: 'text', nullable: true })
  feedback: string;

  @Column({
    name: 'trang_thai',
    type: 'enum',
    enum: INTERVIEW_STATUS,
    default: INTERVIEW_STATUS.PENDING,
  })
  status: INTERVIEW_STATUS;

  @Column({ name: 'tieu_de', type: 'text' })
  summary: string;

  @Column({ name: 'mo_ta', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'email_ung_vien', type: 'text' })
  candidateEmail: string;

  @Column({ name: 'ma_su_kien_gg_calendar', nullable: true })
  googleCalendarEventId: string;

  @Column({ name: 'link_meeting', nullable: true })
  meetingLink: string;

  @Column({ name: 'ma_lich_gg', nullable: true })
  calendarId: string;

  @Column({
    name: 'thoi_gian_tao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'thoi_gian_cap_nhat',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => ApplyJob, (applyJob) => applyJob.interviews)
  @JoinColumn({ name: 'ma_ung_tuyen' })
  applyJob: ApplyJob;
}
