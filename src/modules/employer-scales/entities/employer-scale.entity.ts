import { Employer } from 'src/modules/employer/entities/employer.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'quy_mo_nhan_su' })
export class EmployerScale {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @Column({ name: 'ten_quy_mo', type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'trang_thai', type: 'tinyint', default: 1 })
  status: number;

  @OneToMany(() => Employer, (employer) => employer.employeeScale)
  employers: Employer[];
}
