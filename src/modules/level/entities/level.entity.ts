import { Job } from 'src/modules/job/entities/job.entity';
import { Resume } from 'src/modules/resume/entities/resume.entity';
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
  @Column({ name: 'mo_ta', length: 255 })
  description: string;

  @Column({ name: 'trang_thai', default: 1 })
  status: number;

  @ManyToMany(() => Job, (job) => job.levels)
  jobs: Job[];

  @OneToMany(() => Resume, (resume) => resume.level)
  resumes: Resume[];
}
