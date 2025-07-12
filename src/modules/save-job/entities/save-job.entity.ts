import { Candidate } from 'src/modules/candidate/entities/candidate.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'cong_viec_luu_tru' })
export class SaveJob {
  @PrimaryColumn({ name: 'ma_cong_viec' })
  jobId: string;
  @PrimaryColumn({ name: 'ma_ung_vien' })
  id: number;
  @Column({ name: 'ngay_luu' })
  savedDate: Date;

  @ManyToOne(() => Job, (job) => job.saveJobs)
  @JoinColumn({ name: 'ma_cong_viec', referencedColumnName: 'id' })
  job: Job;
  @ManyToOne(() => Candidate, (candidate) => candidate.saveJobs)
  @JoinColumn({ name: 'ma_ung_vien', referencedColumnName: 'id' })
  candidate: Candidate;
}
