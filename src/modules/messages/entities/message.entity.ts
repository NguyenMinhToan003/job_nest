import { Account } from 'src/modules/account/entities/account.entity';
import { Roomchat } from 'src/modules/roomchat/entities/roomchat.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tin_nhan' })
export class Message {
  @PrimaryGeneratedColumn({ name: 'ma_tin_nhan' })
  id: number;
  @Column({ name: 'noi_dung', type: 'text' })
  content: string;

  @Column({
    name: 'thoi_gian_gui',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  sentAt: Date;
  @Column({ name: 'da_doc', type: 'boolean', default: false })
  isRead: boolean;

  @ManyToOne(() => Roomchat, (room) => room.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ma_phong_nhan_tin', referencedColumnName: 'id' })
  room: Roomchat;

  @ManyToOne(() => Account, (account) => account.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'ma_tai_khoan', referencedColumnName: 'id' })
  sender: Account;
}
