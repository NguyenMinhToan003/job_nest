import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'thong_bao_cai_dat' })
export class NotiSetting {
  @PrimaryColumn({ name: 'ma_nguoi_dung' })
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
}
