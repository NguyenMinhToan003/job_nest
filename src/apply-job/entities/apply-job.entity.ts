import { Job } from 'src/job/entities/job.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'ung_tuyen' })
export class ApplyJob {
  @PrimaryColumn({ name: 'ma_nguoi_dung' })
  userId: number;
  @PrimaryColumn({ name: 'ma_viec_lam' })
  jobId: number;
  @Column({
    name: 'thoi_gian',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  time: Date;
  @Column({ name: 'cv_id', nullable: true })
  cvId: number;
  @Column({ name: 'trang_thai', default: 1 })
  status: number;
  @Column({ name: 'trang_thai_xem', default: 0 })
  viewStatus: number;

  @ManyToOne(() => User, (user) => user.applyJobs)
  @JoinColumn({ name: 'ma_nguoi_dung', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Job, (job) => job.applyJobs)
  @JoinColumn({ name: 'ma_viec_lam', referencedColumnName: 'id' })
  job: Job;
}
