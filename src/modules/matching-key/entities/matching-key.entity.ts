import { MatchingWeight } from 'src/modules/matching-weight/entities/matching-weight.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tieu_chi_danh_gia' })
export class MatchingKey {
  @PrimaryGeneratedColumn({ name: 'ma_tieu_chi' })
  id: number;
  @Column({ name: 'ten_tieu_chi', length: 255 })
  displayName: string;

  @Column({ name: 'truong_du_lieu' })
  fieldName: string;

  @OneToMany(
    () => MatchingWeight,
    (matchingWeight) => matchingWeight.matchingKey,
  )
  matchingWeights: MatchingWeight[];
}
