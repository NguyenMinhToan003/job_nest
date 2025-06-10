import { Employer } from 'src/modules/employer/entities/employer.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'quoc_gia' })
export class Country {
  @PrimaryGeneratedColumn({ name: 'ma_quoc_gia' })
  id: number;
  @Column({ name: 'ten_quoc_gia', length: 255 })
  name: string;
  @Column({ name: 'quoc_ki', length: 255 })
  flag: string;

  @Column({ name: 'ma_cloundinary' })
  publicId: string;

  @OneToMany(() => Employer, (employer) => employer.country)
  employees: Employer[];
}
