import { Module, OnModuleInit } from '@nestjs/common';
import { DistrictService } from './district.service';
import { DistrictController } from './district.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { District } from './entities/district.entity';
import { CityModule } from 'src/modules/city/city.module';
import { CityService } from 'src/modules/city/city.service';

@Module({
  imports: [CityModule, TypeOrmModule.forFeature([District])],
  controllers: [DistrictController],
  providers: [DistrictService],
})
export class DistrictModule implements OnModuleInit {
  constructor(
    private readonly districtService: DistrictService,
    private readonly cityService: CityService,
  ) {}

  async onModuleInit() {
    await this.cityService.fetchAll();
    await this.districtService.fetchAll();
  }
}
