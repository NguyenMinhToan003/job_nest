import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tu_khoa_den' })
export class BlacklistKeyword {
  @PrimaryGeneratedColumn({ name: 'ma_tu_khoa' })
  id: number;

  @Column({ name: 'tu_khoa', type: 'varchar', length: 255, nullable: false })
  keyword: string;
}
