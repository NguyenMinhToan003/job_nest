import { ApplyJob } from 'src/apply-job/entities/apply-job.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'interview' })
export class Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'apply_job_id' })
  applyJobId: number;

  @Column({ name: 'interview_time', type: 'timestamp' })
  interviewTime: Date;

  @Column({ name: 'location', nullable: true })
  location: string;

  @Column({ name: 'interviewer', nullable: true })
  interviewer: string;

  @Column({ name: 'feedback', type: 'text', nullable: true })
  feedback: string;

  @Column({ name: 'status', nullable: true })
  status: string; // VD: Passed, Failed, Pending...

  @ManyToOne(() => ApplyJob, (applyJob) => applyJob.interviews)
  @JoinColumn({ name: 'apply_job_id' })
  applyJob: ApplyJob;
}
