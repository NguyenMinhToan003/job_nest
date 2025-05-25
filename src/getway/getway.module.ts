import { Module } from '@nestjs/common';
import { GetwayService } from './getway.service';
import { GetwayGateway } from './getway.gateway';

@Module({
  providers: [GetwayGateway, GetwayService],
})
export class GetwayModule {}
