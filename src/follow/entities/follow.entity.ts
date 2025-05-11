import { Company } from 'src/company/entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'theo_doi' })
export class Follow {
  @PrimaryColumn({ name: 'ma_nguoi_dung' })
  userId: number;

  @PrimaryColumn({ name: 'ma_doanh_nghiep' })
  companyId: number;

  @Column({
    name: 'thoi_gian',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  time: Date;

  @ManyToOne(() => User, (user) => user.follows)
  @JoinColumn({ name: 'ma_nguoi_dung', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Company, (company) => company.follows)
  @JoinColumn({ name: 'ma_doanh_nghiep', referencedColumnName: 'id' })
  company: Company;
}
