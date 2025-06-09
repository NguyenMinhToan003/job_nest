import { Candidate } from 'src/modules/candidate/entities/candidate.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
@Entity({ name: 'cong_viec_xem' })
export class ViewJob {
  @PrimaryColumn({ name: 'ma_cong_viec' })
  jobId: string;
  @PrimaryColumn({ name: 'ma_ung_vien' })
  userId: string;
  @PrimaryColumn({ name: 'ngay_xem' })
  viewDate: Date;

  @ManyToOne(() => Job, (job) => job.viewJobs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  job: Job;

  @ManyToOne(() => Candidate, (candidate) => candidate.viewJobs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  candidate: Candidate;
}
