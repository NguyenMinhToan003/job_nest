import { City } from 'src/modules/city/entities/city.entity';
import { Skill } from 'src/modules/skill/entities/skill.entity';
import { Candidate } from 'src/modules/candidate/entities/candidate.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'thong_bao_cai_dat' })
export class NotiSetting {
  @PrimaryColumn({ name: 'ma_tai_khoan' })
  userId: string;
  @PrimaryColumn({ name: 'ma_ki_nang' })
  skillId: number;
  @PrimaryColumn({ name: 'ma_thanh_pho' })
  cityId: string;
  @Column({ name: 'trang_thai' })
  status: number;
  @Column({
    name: 'thoi_gian_tao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  time: Date;

  @ManyToOne(() => Candidate, (candidate) => candidate.notiSettings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ma_tai_khoan', referencedColumnName: 'id' })
  candidate: Candidate;

  // Quan hệ tới Skill
  @ManyToOne(() => Skill, (skill) => skill.notiSettings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ma_ki_nang', referencedColumnName: 'id' })
  skill: Skill;

  // Quan hệ tới City
  @ManyToOne(() => City, (city) => city.notiSettings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ma_thanh_pho', referencedColumnName: 'id' })
  city: City;
}
