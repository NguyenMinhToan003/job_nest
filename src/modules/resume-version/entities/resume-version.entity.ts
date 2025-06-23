import { ApplyJob } from 'src/modules/apply-job/entities/apply-job.entity';
import { District } from 'src/modules/district/entities/district.entity';
import { Education } from 'src/modules/education/entities/education.entity';
import { LanguageResume } from 'src/modules/language-resume/entities/language-resume.entity';
import { Level } from 'src/modules/level/entities/level.entity';
import { Major } from 'src/modules/major/entities/major.entity';
import { Resume } from 'src/modules/resume/entities/resume.entity';
import { Skill } from 'src/modules/skill/entities/skill.entity';
import { TypeJob } from 'src/modules/type-job/entities/type-job.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'phien_ban_ho_so' })
export class ResumeVersion {
  @PrimaryGeneratedColumn({ name: 'ma_phien_ban' })
  id: number;

  @Column({ name: 'hinh_anh' })
  avatar: string;

  @Column({ name: 'ho_ten', length: 255 })
  username: string;

  @Column({ name: 'so_dien_thoai', length: 11 })
  phone: string;

  @Column({ name: 'email', nullable: true })
  email: string;

  @Column({
    name: 'gioi_tinh',
    type: 'enum',
    enum: ['NAM', 'NU'],
    nullable: true,
  })
  gender: string;

  @Column({ name: 'dia_diem' })
  location: string;

  @Column({ name: 'ngay_sinh', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ name: 'muc_luong_mong_muon', type: 'int', nullable: true })
  expectedSalary: number;

  @Column({ name: 'public_id_pdf', nullable: false })
  publicIdPdf: string;

  @Column({ name: 'url_pdf', nullable: false })
  urlPdf: string;

  @OneToMany(
    () => LanguageResume,
    (languageResume) => languageResume.resumeVersion,
    {
      nullable: true,
    },
  )
  languageResumes: LanguageResume[];

  @ManyToMany(() => Major, (major) => major.resumeVersions, {
    nullable: true,
  })
  @JoinTable({
    name: 'phien_ban_ho_so_nganh',
    joinColumn: { name: 'ma_phien_ban' },
    inverseJoinColumn: { name: 'ma_nganh' },
  })
  majors: Major[];

  @ManyToOne(() => TypeJob, (typeJob) => typeJob.resumeVersions, {
    nullable: true,
  })
  @JoinColumn({ name: 'ma_loai_cong_viec' })
  typeJob: TypeJob;

  @ManyToMany(() => Skill, (skill) => skill.resumeVersions)
  @JoinTable({
    name: 'phien_ban_ho_so_ky_nang',
    joinColumn: { name: 'ma_phien_ban' },
    inverseJoinColumn: { name: 'ma_ky_nang' },
  })
  skills: Skill[];

  @ManyToOne(() => Education, (education) => education.resumeVersions, {
    nullable: true,
  })
  @JoinColumn({ name: 'ma_trinh_do' })
  education: Education;

  @ManyToOne(() => Level, (level) => level.resumeVersions, {
    nullable: true,
  })
  @JoinColumn({ name: 'ma_cap_bac' })
  level: Level;

  @ManyToOne(() => District, (district) => district.resumeVersions, {
    nullable: true,
  })
  @JoinColumn({ name: 'ma_quan_huyen' })
  district: District;

  @OneToMany(() => ApplyJob, (applyJob) => applyJob.resumeVersion, {
    nullable: true,
  })
  applyJobs: ApplyJob[];

  @ManyToOne(() => Resume, (resume) => resume.resumeVersions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ma_ho_so' })
  resume: Resume;
}
