import { Employer } from 'src/modules/employer/entities/employer.entity';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'linh_vuc' })
export class Major {
  @PrimaryColumn({ name: 'ma_linh_vuc' })
  id: string;
  @PrimaryColumn({ name: 'ten_linh_vuc', length: 255 })
  name: string;
  @PrimaryColumn({ name: 'mo_ta', length: 255 })
  description: string;
  @PrimaryColumn({ name: 'trang_thai', type: 'tinyint' })
  status: number;

  @OneToMany(() => Employer, (employer) => employer.major)
  employers: Employer[];
}
