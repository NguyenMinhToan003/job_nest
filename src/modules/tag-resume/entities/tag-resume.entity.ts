import { ApplyJob } from 'src/modules/apply-job/entities/apply-job.entity';
import { Employer } from 'src/modules/employer/entities/employer.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'gan_the_ho_so' })
export class TagResume {
  @PrimaryGeneratedColumn({ name: 'ma_the' })
  id: number;

  @Column({ name: 'ten_the', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'ma_mau', type: 'varchar', length: 255, nullable: true })
  color: string;

  @ManyToOne(() => Employer, (employer) => employer.tagResumes, {
    nullable: false,
  })
  @JoinColumn({ name: 'ma_nha_tuyen_dung' })
  employer: Employer;

  @ManyToMany(() => ApplyJob, (applyJob) => applyJob.tagResumes)
  applyJobs: ApplyJob[];
}
