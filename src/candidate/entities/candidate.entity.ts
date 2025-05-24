import { Account } from 'src/account/entities/account.entity';
import { Cv } from 'src/cv/entities/cv.entity';
import { Follow } from 'src/follow/entities/follow.entity';
import { NotiSetting } from 'src/noti-setting/entities/noti-setting.entity';
import { SaveJob } from 'src/save-job/entities/save-job.entity';
import { Skill } from 'src/skill/entities/skill.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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
  @Column({ name: 'hinh_anh', length: 255, nullable: true })
  avatar: string;

  @Column({ name: 'so_dien_thoai', length: 20, nullable: true })
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

  @OneToMany(() => Cv, (cv) => cv.user)
  cv: Cv[];

  @OneToOne(() => Account, (account) => account.user)
  @JoinColumn({ name: 'ma_tai_khoan', referencedColumnName: 'id' })
  account: Account;

  @ManyToMany(() => Skill, (skill) => skill.users)
  @JoinTable({
    name: 'nguoi_ung_tuyen_ky_nang',
    joinColumn: { name: 'ma_tai_khoan', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ma_ky_nang', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @OneToMany(() => Follow, (follow) => follow.user)
  follows: Follow[];

  @OneToMany(() => SaveJob, (saveJob) => saveJob.user)
  saveJobs: SaveJob[];

  @OneToMany(() => NotiSetting, (notiSetting) => notiSetting.user)
  notiSettings: NotiSetting[];
}
