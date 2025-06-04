import { Job } from 'src/modules/job/entities/job.entity';
import { Major } from 'src/modules/major/entities/major.entity';
import { NotiSetting } from 'src/modules/noti-setting/entities/noti-setting.entity';
import { ResumeVersion } from 'src/modules/resume-version/entities/resume-version.entity';
import {
  Column,
  Entity,
  JoinColumn,
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

  @ManyToMany(() => Job, (job) => job.skills)
  jobs: Job[];

  @OneToMany(() => NotiSetting, (notiSetting) => notiSetting.skill)
  notiSettings: NotiSetting[];

  @ManyToOne(() => Major, (major) => major.skills)
  @JoinColumn({ name: 'ma_chuyen_mon' })
  major: Major;

  @ManyToMany(() => ResumeVersion, (resumeVersion) => resumeVersion.skills)
  resumeVersions: ResumeVersion[];
}
//reactjs, nodejs, typescript, javascript, ajava, python, ruby, php, c#, c++, go, swift, kotlin
//, html, css, sql, nosql, mongodb, mysql, postgresql, oracle, redis, elasticsearch
// typescript, javascript, java, python, ruby, php, c#, c++, go, swift, kotlin
