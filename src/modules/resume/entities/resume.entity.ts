import { Candidate } from 'src/modules/candidate/entities/candidate.entity';
import { ResumeVersion } from 'src/modules/resume-version/entities/resume-version.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'ho_so' })
export class Resume {
  @PrimaryGeneratedColumn({ name: 'ma_ho_so' })
  id: number;

  @Column({ name: 'ten_ho_so', length: 255, nullable: true })
  name: string;

  @ManyToOne(() => Candidate, (candidate) => candidate.resumes, {
    nullable: false,
  })
  @JoinColumn({ name: 'ma_ung_vien' })
  candidate: Candidate;

  @Column({ name: 'ho_so_mac_dinh', type: 'boolean', default: false })
  isDefault: boolean;

  @OneToMany(() => ResumeVersion, (resumeVersion) => resumeVersion.resume)
  resumeVersions: ResumeVersion[];
}
