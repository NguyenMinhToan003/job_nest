import { City } from 'src/city/entities/city.entity';
import { Location } from 'src/location/entities/location.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'quan_huyen' })
export class District {
  @PrimaryColumn({ name: 'ma_quan_huyen' })
  id: string;

  @Column({ name: 'ten_quan_huyen', length: 255 })
  name: string;

  @ManyToOne(() => City, (city) => city.districts)
  @JoinColumn({ name: 'ma_thanh_pho' })
  city: City;

  @OneToMany(() => Location, (location) => location.district)
  locations: Location[];
}
