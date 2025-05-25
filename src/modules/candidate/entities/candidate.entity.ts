import { Account } from 'src/modules/account/entities/account.entity';
import { Cv } from 'src/modules/cv/entities/cv.entity';
import { Follow } from 'src/modules/follow/entities/follow.entity';
import { Interview } from 'src/modules/interview/entities/interview.entity';
import { NotiSetting } from 'src/modules/noti-setting/entities/noti-setting.entity';
import { SaveJob } from 'src/modules/save-job/entities/save-job.entity';
import { Skill } from 'src/modules/skill/entities/skill.entity';
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

  @OneToMany(() => Cv, (cv) => cv.candidate)
  cv: Cv[];

  @OneToOne(() => Account, (account) => account.candidate)
  @JoinColumn({ name: 'ma_tai_khoan', referencedColumnName: 'id' })
  account: Account;

  @ManyToMany(() => Skill, (skill) => skill.candidates)
  @JoinTable({
    name: 'nguoi_ung_tuyen_ky_nang',
    joinColumn: { name: 'ma_tai_khoan', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ma_ky_nang', referencedColumnName: 'id' },
  })
  skills: Skill[];

  @OneToMany(() => Follow, (follow) => follow.candidate)
  follows: Follow[];

  @OneToMany(() => SaveJob, (saveJob) => saveJob.candidate)
  saveJobs: SaveJob[];

  @OneToMany(() => NotiSetting, (notiSetting) => notiSetting.candidate)
  notiSettings: NotiSetting[];

  @ManyToMany(() => Interview, (interview) => interview.candidates)
  @JoinTable({
    name: 'ung_vien_phong_van',
    joinColumn: { name: 'ma_ung_vien', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ma_phong_van', referencedColumnName: 'id' },
  })
  interviews: Interview[];
}
