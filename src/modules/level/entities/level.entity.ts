import { Job } from 'src/modules/job/entities/job.entity';
import { ResumeVersion } from 'src/modules/resume-version/entities/resume-version.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'cap_bac' })
export class Level {
  @PrimaryGeneratedColumn({ name: 'ma_cap_bac' })
  id: number;
  @Column({ name: 'ten_cap_bac', length: 255 })
  name: string;

  @Column({ name: 'trang_thai', default: 1 })
  status: number;

  @ManyToMany(() => Job, (job) => job.levels)
  jobs: Job[];

  @OneToMany(() => ResumeVersion, (resumeVersion) => resumeVersion.level)
  resumeVersions: ResumeVersion[];
}
