import { ApplyJob } from 'src/apply-job/entities/apply-job.entity';
import { Candidate } from 'src/candidate/entities/candidate.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cv' })
export class Cv {
  @PrimaryGeneratedColumn({ name: 'ma_cv' })
  id: number;

  @Column({ name: 'public_id' })
  publicId: string;

  @Column({ name: 'url' })
  url: string;

  @Column({ name: 'ten_file' })
  name: string;

  @Column({ name: 'dinh_dang' })
  typeFile: string;

  @Column({ name: 'tg_cap_nhat' })
  updatedAt: Date;

  @ManyToOne(() => Candidate, (user) => user.cv, { nullable: false })
  @JoinColumn({ name: 'ma_nguoi_dung' })
  user: Candidate;

  @OneToMany(() => ApplyJob, (applyJob) => applyJob.cv)
  applyJobs: ApplyJob[];
}
