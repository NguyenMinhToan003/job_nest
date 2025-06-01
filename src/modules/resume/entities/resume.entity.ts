import { ApplyJob } from 'src/modules/apply-job/entities/apply-job.entity';
import { Candidate } from 'src/modules/candidate/entities/candidate.entity';
import { Cv } from 'src/modules/cv/entities/cv.entity';
import { District } from 'src/modules/district/entities/district.entity';
import { Experience } from 'src/modules/experience/entities/experience.entity';
import { Level } from 'src/modules/level/entities/level.entity';
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
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'ho_so_xin_viec' })
export class Resume {
  @PrimaryGeneratedColumn({ name: 'ma_ho_so_xin_viec' })
  id: number;

  @Column({ name: 'ten_ho_so', type: 'varchar', length: 255 })
  resumeName: string;

  @Column({ name: 'hinh_anh_ho_so' })
  resumeImage: string;

  @Column({ name: 'ho_va_ten', type: 'varchar', length: 100 })
  userName: string;

  @Column({ name: 'ngay_sinh', type: 'date' })
  dateOfBirth: Date;

  @Column({ name: 'so_dien_thoai', type: 'varchar', length: 11 })
  phoneNumber: string;

  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({ name: 'muc_tieu_nghe_nghiep', type: 'text' })
  career: string;

  @Column({
    name: 'luong_mong_muon_min',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  expectedSalaryMin: number;
  @Column({
    name: 'luong_mong_muon_max',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  expectedSalaryMax: number;

  @Column({ name: 'trang_thai', type: 'tinyint', default: 1 })
  status: number;
  @Column({
    name: 'ngay_tao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({
    name: 'ngay_cap_nhat',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToMany(() => Skill, (skill) => skill.resumes)
  @JoinTable({
    name: 'ho_so_xin_viec_ky_nang',
    joinColumn: { name: 'ma_ho_so_xin_viec', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ma_ky_nang', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @ManyToOne(() => Experience, (experience) => experience.resumes)
  @JoinColumn({ name: 'ma_khinh_nghiem' })
  experience: Experience;

  @ManyToOne(() => Level, (level) => level.resumes)
  @JoinColumn({ name: 'ma_cap_bac_cao_nhat' })
  level: Level;

  @ManyToOne(() => Level, (typeJob) => typeJob.resumes)
  @JoinColumn({ name: 'ma_cap_bac_mong_muon' })
  desiredLevel: Level;

  @ManyToOne(() => TypeJob, (typeJob) => typeJob.resumes)
  @JoinColumn({ name: 'ma_hinh_thuc_lam_viec_mong_muon' })
  typeJob: TypeJob;

  @ManyToOne(() => District, (district) => district.resumes)
  @JoinColumn({ name: 'ma_quan_huyen' })
  district: District;

  @OneToOne(() => Cv, (cv) => cv.resume, { nullable: true })
  @JoinColumn({ name: 'ma_cv' })
  cv: Cv;

  @OneToMany(() => ApplyJob, (applyJob) => applyJob.cv)
  applyJobs: ApplyJob[];

  @ManyToOne(() => Candidate, (candidate) => candidate.resumes, {
    nullable: false,
  })
  @JoinColumn({ name: 'ma_nguoi_dung' })
  candidate: Candidate;
}
