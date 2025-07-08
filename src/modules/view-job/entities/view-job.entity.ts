import { Candidate } from 'src/modules/candidate/entities/candidate.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
@Entity({ name: 'cong_viec_xem' })
export class ViewJob {
  @PrimaryColumn({ name: 'ma_cong_viec' })
  jobId: number;
  @PrimaryColumn({ name: 'ma_ung_vien' })
  candidateId: number;
  @Column({
    name: 'ngay_xem',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  viewDate: Date;

  @ManyToOne(() => Job, (job) => job.viewJobs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ma_cong_viec' })
  job: Job;

  @ManyToOne(() => Candidate, (candidate) => candidate.viewJobs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ma_ung_vien' })
  candidate: Candidate;
}
