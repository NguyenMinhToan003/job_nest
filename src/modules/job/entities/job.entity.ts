import { Education } from 'src/modules/education/entities/education.entity';
import { ApplyJob } from 'src/modules/apply-job/entities/apply-job.entity';
import { Benefit } from 'src/modules/benefit/entities/benefit.entity';
import { Employer } from 'src/modules/employer/entities/employer.entity';
import { Experience } from 'src/modules/experience/entities/experience.entity';
import { Level } from 'src/modules/level/entities/level.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { SaveJob } from 'src/modules/save-job/entities/save-job.entity';
import { Skill } from 'src/modules/skill/entities/skill.entity';
import { TypeJob } from 'src/modules/type-job/entities/type-job.entity';
import { JOB_STATUS } from 'src/types/enum';
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
import { LanguageJob } from 'src/modules/language-job/entities/language-job.entity';
import { MatchingWeight } from 'src/modules/matching-weight/entities/matching-weight.entity';

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

  @Column({
    name: 'luong_min',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  minSalary: number | null;

  @Column({
    name: 'luong_max',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  maxSalary: number | null;

  @Column({ name: 'hien_thi_cong_viec', type: 'tinyint', default: 1 })
  isShow: number;

  @Column({
    name: 'thoi_gian_tao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'thoi_gian_cap_nhat',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({
    name: 'trang_thai',
    type: 'int',
    default: JOB_STATUS.PENDING,
  })
  isActive: number;

  @Column({
    name: 'thoi_gian_het_han',
    type: 'timestamp',
    default: () => 'DATE_ADD(NOW(), INTERVAL 28 DAY)',
  })
  expiredAt: Date;
  @ManyToOne(() => Employer, (employer) => employer.jobs, { nullable: false })
  @JoinColumn({ name: 'ma_cong_ty' })
  employer: Employer;
  @ManyToMany(() => Location, (location) => location.jobs, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'dia_diem_cong_viec',
    joinColumn: {
      name: 'ma_cong_viec',
    },
    inverseJoinColumn: {
      name: 'ma_dia_diem',
    },
  })
  locations: Location[];

  @ManyToMany(() => TypeJob, (typeJob) => typeJob.jobs, {
    onDelete: 'CASCADE',
  })
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

  @ManyToMany(() => Level, (level) => level.jobs, {
    onDelete: 'CASCADE',
  })
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

  @ManyToMany(() => Benefit, (benefit) => benefit.jobs, {
    onDelete: 'CASCADE',
  })
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

  @ManyToOne(() => Education, (education) => education.jobs)
  @JoinColumn({ name: 'ma_trinh_do' })
  education: Education;

  @OneToMany(() => LanguageJob, (languageJob) => languageJob.job, {
    nullable: true,
  })
  languageJobs: LanguageJob[];

  @OneToMany(() => MatchingWeight, (matchingWeight) => matchingWeight.job)
  matchingWeights: MatchingWeight[];
}
