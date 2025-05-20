import { APPLY_JOB_STATUS } from 'src/decorators/customize';
import { Job } from 'src/job/entities/job.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'ung_tuyen' })
export class ApplyJob {
  @PrimaryGeneratedColumn({ name: 'ma_ung_tuyen' })
  id: number;

  @Column({ name: 'ma_nguoi_dung' })
  userId: number;

  @Column({ name: 'ma_viec_lam' })
  jobId: number;

  @Column({
    name: 'thoi_gian',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  time: Date;

  @Column({ name: 'cv_id', nullable: true })
  cvId: number;

  @Column({
    name: 'trang_thai',
    type: 'enum',
    enum: APPLY_JOB_STATUS,
    enumName: 'apply_job_status',
    default: APPLY_JOB_STATUS.APPLY,
  })
  status: APPLY_JOB_STATUS;

  @Column({ name: 'ghi_chu', nullable: true })
  note: string;
  @Column({ name: 'thoi_gian_tra_loi', nullable: true, type: 'timestamp' })
  replyTime: Date;
  @Column({
    name: 'thoi_gian_hen_phong_van',
    nullable: true,
    type: 'timestamp',
  })
  interviewTime: Date;

  @Column({ name: 'trang_thai_xem' })
  viewStatus: number;

  @ManyToOne(() => User, (user) => user.applyJobs)
  @JoinColumn({ name: 'ma_nguoi_dung' })
  user: User;

  @ManyToOne(() => Job, (job) => job.applyJobs)
  @JoinColumn({ name: 'ma_viec_lam' })
  job: Job;
}
