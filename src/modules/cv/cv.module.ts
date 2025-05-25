import { Module } from '@nestjs/common';
import { CvService } from './cv.service';
import { CvController } from './cv.controller';
import { UploadModule } from 'src/upload/upload.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cv } from './entities/cv.entity';

@Module({
  imports: [UploadModule, TypeOrmModule.forFeature([Cv])],
  controllers: [CvController],
  providers: [CvService],
  exports: [CvService],
})
export class CvModule {}
