import { Company } from 'src/company/entities/company.entity';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity({ name: 'quoc_gia' })
export class Country {
  @PrimaryColumn({ name: 'ma_quoc_gia' })
  code: string;
  @Column({ name: 'ten_quoc_gia', length: 255 })
  name: string;
  @Column({ name: 'quoc_ki', length: 255 })
  flag: string;

  @OneToMany(() => Company, (company) => company.country)
  companies: Company[];
}
