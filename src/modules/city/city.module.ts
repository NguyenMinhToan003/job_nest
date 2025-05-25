import { Module, OnModuleInit } from '@nestjs/common';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City])],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
// export class CityModule implements OnModuleInit {
//   constructor(private readonly cityService: CityService) {}

//   async onModuleInit() {
//     await this.cityService.fetchAll();
//   }
// }
export class CityModule {}
