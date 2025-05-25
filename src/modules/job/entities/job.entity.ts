import { ApplyJob } from 'src/modules/apply-job/entities/apply-job.entity';
import { Benefit } from 'src/modules/benefit/entities/benefit.entity';
import { Employer } from 'src/modules/employer/entities/employer.entity';
import { Experience } from 'src/modules/experience/entities/experience.entity';
import { Level } from 'src/modules/level/entities/level.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { Major } from 'src/modules/major/entities/major.entity';
import { SaveJob } from 'src/modules/save-job/entities/save-job.entity';
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

@Entity({ name: 'cong_viec' })
export class Job {
  @PrimaryGeneratedColumn({ name: 'ma_cong_viec' })
  id: number;

  @Column({ name: 'ten_cong_viec', length: 255 })
  name: string;

  @Column({ name: 'mo_ta', length: 255 })
  description: string;

  @Column({ name: 'so_luong_tuyen', type: 'int' })
  quantity: number;

  @Column({ name: 'yeu_cau', length: 255 })
  requirement: string;

  @Column({ name: 'luong_min', type: 'float' })
  minSalary: number;

  @Column({ name: 'luong_max', type: 'float' })
  maxSalary: number;

  @Column({ name: 'hien_thi_cong_viec', type: 'tinyint', default: 1 })
  isShow: number;

  @Column({ name: 'thoi_gian_tao', type: 'timestamp' })
  createdAt: Date;

  @Column({ name: 'trang_thai', type: 'tinyint' })
  isActive: number;

  @Column({
    name: 'thoi_gian_het_han',
    type: 'timestamp',
    default: () => 'DATE_ADD(NOW(), INTERVAL 28 DAY)',
  })
  expiredAt: Date;

  @ManyToMany(() => Major, (major) => major.jobs)
  @JoinTable({
    name: 'nganh_nghe_cong_viec',
    joinColumn: {
      name: 'ma_cong_viec',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ma_nganh_nghe',
      referencedColumnName: 'id',
    },
  })
  majors: Major[];
  @ManyToOne(() => Employer, (employer) => employer.jobs, { nullable: false })
  @JoinColumn({ name: 'ma_cong_ty' })
  employer: Employer;
  @ManyToMany(() => Location, (location) => location.jobs)
  @JoinTable({
    name: 'dia_diem_cong_viec',
    joinColumn: {
      name: 'ma_cong_viec',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ma_dia_diem',
      referencedColumnName: 'id',
    },
  })
  locations: Location[];

  @Column({ name: 'cau_hoi_thu_viec', length: 255 })
  interviewQuestion: string;

  @Column({ name: 'co_bat_buoc_tra_loi', type: 'tinyint', default: 0 })
  isRequiredQuestion: number;

  @ManyToMany(() => TypeJob, (typeJob) => typeJob.jobs)
  @JoinTable({
    name: 'loai_hinh_lam_viec_cong_viec',
    joinColumn: {
      name: 'ma_cong_viec',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ma_hinh_thuc_lam_viec',
      referencedColumnName: 'id',
    },
  })
  typeJobs: TypeJob[];

  @ManyToMany(() => Level, (level) => level.jobs)
  @JoinTable({
    name: 'cap_bac_cong_viec',
    joinColumn: {
      name: 'ma_cong_viec',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ma_cap_bac',
      referencedColumnName: 'id',
    },
  })
  levels: Level[];

  @ManyToMany(() => Benefit, (benefit) => benefit.jobs)
  @JoinTable({
    name: 'phuc_loi_cong_viec',
    joinColumn: {
      name: 'ma_cong_viec',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ma_phuc_loi',
      referencedColumnName: 'id',
    },
  })
  benefits: Benefit[];

  @OneToMany(() => SaveJob, (saveJob) => saveJob.job)
  saveJobs: SaveJob[];

  @OneToMany(() => ApplyJob, (applyJob) => applyJob.job)
  applyJobs: ApplyJob[];

  @ManyToOne(() => Experience, (experience) => experience.jobs)
  @JoinColumn({ name: 'ma_khinh_nghiem' })
  experience: Experience;

  @ManyToMany(() => Skill, (skill) => skill.jobs)
  @JoinTable({
    name: 'cong_viec_ky_nang',
    joinColumn: {
      name: 'ma_cong_viec',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ma_ky_nang',
      referencedColumnName: 'id',
    },
  })
  skills: Skill[];
}
