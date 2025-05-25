import { Module, OnModuleInit } from '@nestjs/common';
import { MajorService } from './major.service';
import { MajorController } from './major.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Major } from './entities/major.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Major])],
  controllers: [MajorController],
  providers: [MajorService],
})
export class MajorModule implements OnModuleInit {
  constructor(private readonly majorService: MajorService) {}

  onModuleInit() {
    this.majorService.createDefaultMajor();
  }
}
