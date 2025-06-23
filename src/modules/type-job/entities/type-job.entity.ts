import { Job } from 'src/modules/job/entities/job.entity';
import { ResumeVersion } from 'src/modules/resume-version/entities/resume-version.entity';
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

  @ManyToMany(() => Job, (job) => job.typeJobs)
  jobs: Job[];

  @OneToMany(() => ResumeVersion, (resumeVersion) => resumeVersion.typeJob)
  resumeVersions: ResumeVersion[];
}
