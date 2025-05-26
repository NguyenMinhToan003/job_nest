import { Account } from 'src/modules/account/entities/account.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'thong_bao_tai_khoan' })
export class NotiAccount {
  @PrimaryGeneratedColumn({ name: 'ma_thong_bao' })
  id: number;

  @Column({ name: 'tiei_de' })
  title: string;
  @Column({ name: 'noi_dung' })
  content: string;

  @Column({ name: 'loai_thong_bao' })
  type: string;
  @Column({
    name: 'thoi_gian',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  time: Date;

  @Column({ name: 'da_doc', default: 0 })
  isRead: number;

  @Column({ name: 'duong_dan' })
  link: string;

  @ManyToOne(() => Account, (account) => account.senderAccount, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tai_khoan_gui', referencedColumnName: 'id' })
  senderAccount: Account;

  @ManyToOne(() => Account, (account) => account.receiverAccount, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tai_khoan_nhan', referencedColumnName: 'id' })
  receiverAccount: Account;
}
