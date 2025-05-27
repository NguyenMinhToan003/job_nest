import { Account } from 'src/modules/account/entities/account.entity';
import { Message } from 'src/modules/messages/entities/message.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'phong_nhan_tin' })
export class Roomchat {
  @PrimaryGeneratedColumn({ name: 'ma_phong_nhan_tin' })
  id: number;
  @Column({ name: 'ten_phong_nhan_tin', type: 'varchar', length: 255 })
  name: string;
  @ManyToMany(() => Account, (account) => account.rooms)
  @JoinTable({
    name: 'phong_nhan_tin_tai_khoan',
    joinColumn: { name: 'ma_phong_nhan_tin', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'ma_tai_khoan', referencedColumnName: 'id' },
  })
  accounts: Account[];
  @Column({
    name: 'ngay_tao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
  @Column({
    name: 'ngay_cap_nhat',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Message, (message) => message.room, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  messages: Message[];
}
