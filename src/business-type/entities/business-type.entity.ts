import { Employer } from 'src/modules/employer/entities/employer.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'loai_hinh_kinh_doanh' })
export class BusinessType {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'ten_loai_hinh_kinh_doanh', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'trang_thai', type: 'tinyint', default: 1 })
  status: number;

  @OneToMany(() => Employer, (employer) => employer.businessType)
  employers: Employer[];
}
