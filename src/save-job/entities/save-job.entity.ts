import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Job } from 'src/job/entities/job.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'cong_viec_luu_tru' })
export class SaveJob {
  @PrimaryColumn({ name: 'ma_cong_viec' })
  jobId: string;
  @PrimaryColumn({ name: 'ma_tai_khoan' })
  id: number;
  @Column({ name: 'ngay_luu' })
  savedDate: Date;

  @ManyToOne(() => Job, (job) => job.saveJobs)
  @JoinColumn({ name: 'ma_cong_viec', referencedColumnName: 'id' })
  job: Job;
  @ManyToOne(() => Candidate, (user) => user.saveJobs)
  @JoinColumn({ name: 'ma_tai_khoan', referencedColumnName: 'id' })
  user: Candidate;
}
