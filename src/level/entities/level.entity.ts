import { Job } from 'src/job/entities/job.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'cap_bac' })
export class Level {
  @PrimaryColumn({ name: 'ma_cap_bac' })
  id: string;
  @Column({ name: 'ten_cap_bac', length: 255 })
  name: string;
  @Column({ name: 'mo_ta', length: 255 })
  description: string;
  @OneToMany(() => Job, (job) => job.level)
  jobs: Job[];
}

// SinhVien/ThucTapSinh, MoiTotNghiep, NhanVien, QuanLy, PhoGiamDoc, GiamDoc, TongGiamDoc, ChuTich, ChuTichHĐQT
