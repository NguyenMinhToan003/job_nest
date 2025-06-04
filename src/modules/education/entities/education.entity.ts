import { Job } from 'src/modules/job/entities/job.entity';
import { ResumeVersion } from 'src/modules/resume-version/entities/resume-version.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'bang_cap' })
export class Education {
  @PrimaryGeneratedColumn({ name: 'ma_bang_cap' })
  id: number;

  @Column({ name: 'ten_bang_cap', length: 255 })
  name: string;

  @Column({ name: 'trang_thai', type: 'tinyint', default: 1 })
  status: number;

  @Column({ name: 'trong_so', type: 'int', nullable: false })
  weight: number;

  @OneToMany(() => Job, (job) => job.education)
  jobs: Job[];

  @OneToMany(() => ResumeVersion, (resumeVersion) => resumeVersion.education)
  resumeVersions: ResumeVersion[];
}
