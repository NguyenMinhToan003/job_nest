import { Job } from 'src/job/entities/job.entity';
import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'nganh_nghe' })
export class Major {
  @PrimaryColumn({ name: 'ma_nganh_nghe' })
  id: string;
  @PrimaryColumn({ name: 'ten_nganh_nghe', length: 255 })
  name: string;
  @PrimaryColumn({ name: 'mo_ta', length: 255 })
  description: string;
  @PrimaryColumn({ name: 'trang_thai', type: 'tinyint' })
  status: number;

  @ManyToMany(() => Job, (job) => job.majors)
  @JoinTable({
    name: 'nganh_nghe_cong_viec',
    joinColumn: {
      name: 'ma_nganh_nghe',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'ma_cong_viec',
      referencedColumnName: 'id',
    },
  })
  jobs: Job[];
}
// TiepThi/Marketing, KeToan/Accounting, QuanTriKinhDoanh/BusinessAdministration, QuanLyChungKhoan/SecuritiesManagement, QuanLyNganHang/BankManagement, QuanLyDuAn/ProjectManagement, QuanLyChuyenMon/ProfessionalManagement, QuanLyChuyenVien/ProfessionalManager, QuanLyNhaHang/RestaurantManagement, QuanLyKhachSan/HotelManagement, QuanLyDuLich/TourismManagement
