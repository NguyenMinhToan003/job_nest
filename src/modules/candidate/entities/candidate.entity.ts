import { Account } from 'src/modules/account/entities/account.entity';
import { Follow } from 'src/modules/follow/entities/follow.entity';
import { NotiSetting } from 'src/modules/noti-setting/entities/noti-setting.entity';
import { SaveJob } from 'src/modules/save-job/entities/save-job.entity';
import { Resume } from 'src/modules/resume/entities/resume.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'nguoi_ung_tuyen' })
export class Candidate {
  @PrimaryColumn({ name: 'ma_tai_khoan' })
  id: number;

  @Column({ name: 'ho_ten', length: 255, nullable: true })
  name: string;
  @Column({ name: 'hinh_anh', nullable: true })
  avatar: string;

  @Column({ name: 'so_dien_thoai', length: 11, nullable: true })
  phone: string;

  @Column({
    name: 'gioi_tinh',
    type: 'enum',
    enum: ['NAM', 'NU'],
    nullable: true,
  })
  gender: string;
  @Column({ name: 'cap_bac_id', nullable: true })
  employmentRankId: number;
  @Column({ name: 'kinh_nghiem_id', nullable: true })
  employmentExperienceId: number;
  @Column({ name: 'hinh_thuc_lam_viec_id', nullable: true })
  employmentTypeId: number;

  @OneToOne(() => Account, (account) => account.candidate)
  @JoinColumn({ name: 'ma_tai_khoan', referencedColumnName: 'id' })
  account: Account;

  @OneToMany(() => Follow, (follow) => follow.candidate)
  follows: Follow[];

  @OneToMany(() => SaveJob, (saveJob) => saveJob.candidate)
  saveJobs: SaveJob[];

  @OneToMany(() => NotiSetting, (notiSetting) => notiSetting.candidate)
  notiSettings: NotiSetting[];

  @OneToMany(() => Resume, (resume) => resume.candidate)
  resumes: Resume[];
}
