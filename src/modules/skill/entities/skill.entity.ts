import { Candidate } from 'src/modules/candidate/entities/candidate.entity';
import { Job } from 'src/modules/job/entities/job.entity';
import { Major } from 'src/modules/major/entities/major.entity';
import { NotiSetting } from 'src/modules/noti-setting/entities/noti-setting.entity';
import { Resume } from 'src/modules/resume/entities/resume.entity';
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

@Entity({ name: 'ky_nang' })
export class Skill {
  @PrimaryGeneratedColumn({ name: 'ma_ky_nang' })
  id: number;
  @Column({ name: 'ten_ky_nang', length: 255 })
  name: string;

  @Column({ name: 'trang_thai', type: 'tinyint', default: 1 })
  status: number;

  @ManyToMany(() => Candidate, (candidate) => candidate.skills)
  @JoinTable({
    name: 'nguoi_ung_tuyen_ky_nang',
    joinColumn: { name: 'ma_ky_nang', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'ma_tai_khoan',
      referencedColumnName: 'id',
    },
  })
  candidates: Candidate[];

  @ManyToMany(() => Job, (job) => job.skills)
  @JoinTable({
    name: 'cong_viec_ky_nang',
    joinColumn: { name: 'ma_ky_nang', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'ma_cong_viec',
      referencedColumnName: 'id',
    },
  })
  jobs: Job[];

  @OneToMany(() => NotiSetting, (notiSetting) => notiSetting.skill)
  notiSettings: NotiSetting[];

  @ManyToMany(() => Resume, (resume) => resume.skills)
  @JoinTable({
    name: 'ho_so_xin_viec_ky_nang',
    joinColumn: { name: 'ma_ky_nang', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'ma_ho_so_xin_viec',
      referencedColumnName: 'id',
    },
  })
  resumes: Resume[];

  @ManyToOne(() => Major, (major) => major.skills)
  @JoinColumn({ name: 'ma_chuyen_mon' })
  major: Major;
}
//reactjs, nodejs, typescript, javascript, ajava, python, ruby, php, c#, c++, go, swift, kotlin
//, html, css, sql, nosql, mongodb, mysql, postgresql, oracle, redis, elasticsearch
// typescript, javascript, java, python, ruby, php, c#, c++, go, swift, kotlin
