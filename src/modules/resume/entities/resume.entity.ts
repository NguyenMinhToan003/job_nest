import { Candidate } from 'src/modules/candidate/entities/candidate.entity';
import { ResumeVersion } from 'src/modules/resume-version/entities/resume-version.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'ho_so_xin_viec' })
export class Resume {
  @PrimaryGeneratedColumn({ name: 'ma_ho_so' })
  id: number;

  @ManyToOne(() => Candidate, (candidate) => candidate.resumes, {
    nullable: false,
  })
  @JoinColumn({ name: 'ma_ung_vien' })
  candidate: Candidate;

  @OneToMany(() => ResumeVersion, (resumeVersion) => resumeVersion.resume)
  resumeVersions: ResumeVersion[];
}
