import { Account } from 'src/modules/account/entities/account.entity';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'admin' })
export class Admin {
  @PrimaryColumn({ name: 'ma_tai_khoan' })
  id: number;

  @OneToOne(() => Account, (account) => account.id)
  @JoinColumn({ name: 'ma_tai_khoan' })
  account: Account;
}
