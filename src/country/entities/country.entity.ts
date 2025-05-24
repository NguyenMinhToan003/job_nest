import { Employer } from 'src/employer/entities/employer.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'quoc_gia' })
export class Country {
  @PrimaryColumn({ name: 'ma_quoc_gia' })
  code: string;
  @Column({ name: 'ten_quoc_gia', length: 255 })
  name: string;
  @Column({ name: 'quoc_ki', length: 255 })
  flag: string;

  @OneToMany(() => Employer, (employer) => employer.country)
  companies: Employer[];
}
