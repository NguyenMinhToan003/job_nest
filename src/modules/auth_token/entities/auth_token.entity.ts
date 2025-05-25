import { Account } from 'src/modules/account/entities/account.entity';
import { PROVIDER_LIST } from 'src/types/enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'token_tai_khoan' })
export class AuthToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ma_tai_khoan' })
  accountId: number;

  @Column({
    name: 'ho_tro_loai',
    type: 'enum',
    enum: PROVIDER_LIST,
    enumName: 'ho_tro_loai',
    default: PROVIDER_LIST.GOOGLE,
  })
  provider: string;

  @Column({ name: 'access_token', type: 'text' })
  accessToken: string;

  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken: string;

  @Column({ name: 'thoi_gian_het_han', type: 'timestamp', nullable: true })
  tokenExpiry: Date;

  @Column({
    name: 'thoi_gian_tao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    name: 'thoi_gian_cap_nhat',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => Account, (account) => account.authTokens)
  @JoinColumn({ name: 'ma_tai_khoan' })
  account: Account;
}
