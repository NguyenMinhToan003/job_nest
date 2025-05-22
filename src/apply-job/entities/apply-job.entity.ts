import { Cv } from 'src/cv/entities/cv.entity';
import { Job } from 'src/job/entities/job.entity';
import { APPLY_JOB_STATUS } from 'src/types/enum';
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

  @Column({ name: 'ma_viec_lam' })
  jobId: number;

  @Column({
    name: 'thoi_gian',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  time: Date;

  @Column({ name: 'ten_ung_vien', nullable: false })
  username: string;

  @Column({ name: 'so_dien_thoai', nullable: false })
  phone: string;

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

  @ManyToOne(() => Job, (job) => job.applyJobs)
  @JoinColumn({ name: 'ma_viec_lam' })
  job: Job;

  @ManyToOne(() => Cv, (cv) => cv.applyJobs)
  @JoinColumn({ name: 'ma_cv' })
  cv: Cv;
}
