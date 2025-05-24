import { Account } from 'src/account/entities/account.entity';
import { Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'admin' })
export class Admin {
  @PrimaryColumn({ name: 'ma_tai_khoan' })
  id: number;
  @PrimaryColumn({ name: 'chuc_vu_id' })
  roleId: number;
  @PrimaryColumn({ name: 'trang_thai' })
  status: number;

  @OneToOne(() => Account, (account) => account.id)
  @JoinColumn({ name: 'ma_tai_khoan' })
  account: Account;
}
