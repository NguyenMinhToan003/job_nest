import { Job } from 'src/modules/job/entities/job.entity';
import { Resume } from 'src/modules/resume/entities/resume.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'hinh_thuc_lam_viec' })
export class TypeJob {
  @PrimaryGeneratedColumn({ name: 'ma_hinh_thuc_lam_viec' })
  id: number;
  @Column({ name: 'ten_hinh_thuc_lam_viec', length: 255 })
  name: string;

  @Column({ name: 'trang_thai', type: 'tinyint', default: 1 })
  status: number;

  @Column({ name: 'mo_ta', type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Job, (job) => job.typeJobs)
  jobs: Job[];

  @OneToMany(() => Resume, (resume) => resume.typeJob)
  resumes: Resume[];
}
