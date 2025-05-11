import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'danh_gia' })
export class Rate {
  @PrimaryGeneratedColumn({ name: 'ma_danh_gia' })
  id: number;
  @Column({ name: 'ma_doanh_nghiep' })
  companyId: number;
  @Column({ name: 'ma_nguoi_dung' })
  userId: number;
  @Column({ name: 'diem_so' })
  score: number;
  @Column({ name: 'binh_luan', length: 255 })
  comment: string;
  @Column({ name: 'thoi_gian' })
  time: Date;
  @Column({ name: 'trang_thai' })
  status: number;
}
