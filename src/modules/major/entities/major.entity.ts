import { Field } from 'src/modules/field/entities/field.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import { ResumeVersion } from 'src/modules/resume-version/entities/resume-version.entity';
import { Skill } from 'src/modules/skill/entities/skill.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'chuyen_nganh' })
export class Major {
  @PrimaryGeneratedColumn({ name: 'ma_chuyen_nganh' })
  id: number;
  @Column({ name: 'ten_chuyen_nganh', length: 255 })
  name: string;

  @ManyToOne(() => Field, (field) => field.majors)
  @JoinColumn({ name: 'ma_linh_vuc' })
  field: Field;

  @OneToMany(() => Skill, (skill) => skill.major)
  skills: Skill[];

  @ManyToMany(() => Job, (job) => job.majors)
  jobs: Job[];

  @ManyToMany(() => ResumeVersion, (resumeVersion) => resumeVersion.majors)
  resumeVersions: ResumeVersion[];
}
