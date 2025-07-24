import { Account } from 'src/modules/account/entities/account.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'admin' })
export class Admin {
  @PrimaryColumn({ name: 'ma_tai_khoan' })
  id: number;

  @Column({ name: 'ho_ten', length: 255, nullable: true })
  name: string;

  @Column({ name: 'hinh_anh', nullable: true })
  avatar: string;

  @OneToOne(() => Account, (account) => account.id)
  @JoinColumn({ name: 'ma_tai_khoan' })
  account: Account;
}
