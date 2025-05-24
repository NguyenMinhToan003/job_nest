import { Candidate } from 'src/candidate/entities/candidate.entity';
import { Job } from 'src/job/entities/job.entity';
import { NotiSetting } from 'src/noti-setting/entities/noti-setting.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'ky_nang' })
export class Skill {
  @PrimaryGeneratedColumn({ name: 'ma_ky_nang' })
  id: number;
  @Column({ name: 'ten_ky_nang', length: 255 })
  name: string;
  @Column({ name: 'mo_ta', length: 255 })
  description: string;

  @Column({ name: 'trang_thai', type: 'tinyint' })
  status: number;

  @ManyToMany(() => Candidate, (user) => user.skills)
  @JoinTable({
    name: 'nguoi_ung_tuyen_ky_nang',
    joinColumn: { name: 'ma_ky_nang', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'ma_tai_khoan',
      referencedColumnName: 'id',
    },
  })
  users: Candidate[];

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
}
//reactjs, nodejs, typescript, javascript, java, python, ruby, php, c#, c++, go, swift, kotlin
//, html, css, sql, nosql, mongodb, mysql, postgresql, oracle, redis, elasticsearch
// typescript, javascript, java, python, ruby, php, c#, c++, go, swift, kotlin
